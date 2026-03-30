/**
 * useQuiz.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hook encapsulating all quiz state, shuffle logic, anti-cheat detection,
 * and adaptive difficulty.
 *
 * Features:
 *  - Fisher-Yates question & option shuffle on session start
 *  - Tab/window blur → reshuffle + penalty + mascot warning
 *  - Per-answer timer (countdown)
 *  - Tracks wrong questions for timestamp feedback
 *  - Exposes handlers for all question types
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { type RichQuestion, shuffle, getRandomQuestions } from '@/lib/questionBank';
import { QUESTS } from '@/lib/data';

export interface ShuffledQuestion extends RichQuestion {
  // For MCQ/TrueFalse/Image: shuffled options + remapped correctIndex
  displayOptions: string[];
  mappedCorrectIndex: number;
  // For Match: shuffled right-side items per question
  shuffledRights?: string[];
  // For Sequence: scrambled order to display
  shuffledSequence?: string[];
}

export interface QuizState {
  questions: ShuffledQuestion[];
  currentIndex: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  score: number;
  wrongIds: string[];
  timeLeft: number;
  showHint: boolean;
  antiCheatTriggered: boolean;
  penaltyCount: number;
  mascotMsg: string;
  matchSelections: Record<string, string>;   // left → selected right
  fillInput: string;
  sequenceOrder: string[];
}

export interface QuizActions {
  selectMcq: (idx: number) => void;
  submitFill: () => void;
  setFillInput: (v: string) => void;
  submitMatch: () => void;
  setMatchSelection: (left: string, right: string) => void;
  submitSequence: () => void;
  moveSequenceItem: (from: number, to: number) => void;
  nextQuestion: () => void;
  dismissAntiCheat: () => void;
}

function buildShuffled(q: RichQuestion): ShuffledQuestion {
  // For MCQ / TrueFalse / Image: shuffle the options array and remap correctIndex
  let displayOptions = q.options ?? [];
  let mappedCorrectIndex = q.correctIndex ?? 0;

  if (q.type === 'mcq' || q.type === 'image') {
    const original = q.options ?? [];
    const correctText = original[q.correctIndex ?? 0];
    displayOptions = shuffle(original);
    mappedCorrectIndex = displayOptions.indexOf(correctText);
  }
  // TrueFalse: keep as-is (True / False order preserved)

  // For Match: shuffle right-side items
  const shuffledRights = q.pairs
    ? shuffle(q.pairs.map(p => p.right))
    : undefined;

  // For Sequence: scramble the correct order
  const shuffledSequence = q.sequence ? shuffle(q.sequence) : undefined;

  return { ...q, displayOptions, mappedCorrectIndex, shuffledRights, shuffledSequence };
}

const QUESTION_COUNT = 6;
const SECONDS_PER_Q = 18;

export function useQuiz(questId: string, focusLevel = 50, onComplete?: (score: number, total: number, wrongIds: string[]) => void) {
  // ── Session initialisation ──────────────────────────────────────────────────
  const buildSession = useCallback(() => {
    let raw = getRandomQuestions(questId, QUESTION_COUNT, focusLevel, questId.startsWith('math'));
    if (raw.length === 0) {
      // Fallback to inline quest data
      const questData = QUESTS.find(q => q.id === questId);
      if (questData && questData.quiz) {
         raw = questData.quiz.map(q => ({
           id: q.id,
           type: 'mcq' as const,
           question: q.question,
           options: q.options,
           correctIndex: q.correctIndex,
           hint: q.hint,
           difficulty: 2 as const,
         }));
      }
    }
    return raw.map(buildShuffled);
  }, [questId, focusLevel]);

  const [state, setState] = useState<QuizState>(() => ({
    questions: buildSession(),
    currentIndex: 0,
    selectedAnswer: null,
    isAnswered: false,
    score: 0,
    wrongIds: [],
    timeLeft: SECONDS_PER_Q,
    showHint: false,
    antiCheatTriggered: false,
    penaltyCount: 0,
    mascotMsg: '',
    matchSelections: {},
    fillInput: '',
    sequenceOrder: [],
  }));

  // Expose mutable ref for timer callback to access latest isAnswered
  const answeredRef = useRef(state.isAnswered);
  answeredRef.current = state.isAnswered;

  // Current question shorthand
  const current = state.questions[state.currentIndex];

  // ── Initialise sequence order when question changes ─────────────────────────
  useEffect(() => {
    if (current?.type === 'sequence') {
      setState(s => ({ ...s, sequenceOrder: current.shuffledSequence ?? [] }));
    }
  }, [state.currentIndex, current?.type]);

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!current || state.isAnswered) return;
    if (state.timeLeft <= 0) {
      // Time up → mark wrong
      _recordAnswer(false, '⏰ TIME UP');
      return;
    }
    const id = setInterval(() => {
      setState(s => {
        if (s.isAnswered) return s;
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.currentIndex, state.isAnswered, state.timeLeft]);

  // ── Anti-cheat: tab / window blur ───────────────────────────────────────────
  useEffect(() => {
    const onBlur = () => {
      if (answeredRef.current) return; // ignore if already answered
      const reshuffled = buildSession();
      setState(s => ({
        ...s,
        questions: reshuffled,
        currentIndex: 0,
        selectedAnswer: null,
        isAnswered: false,
        score: Math.max(0, s.score - 5),
        timeLeft: SECONDS_PER_Q,
        showHint: false,
        antiCheatTriggered: true,
        penaltyCount: s.penaltyCount + 1,
        matchSelections: {},
        fillInput: '',
        sequenceOrder: reshuffled[0]?.shuffledSequence ?? [],
      }));
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [buildSession]);

  // ── Internal helpers ────────────────────────────────────────────────────────
  function _recordAnswer(correct: boolean, answerLabel: string) {
    setState(s => {
      const newWrong = correct ? s.wrongIds : [...s.wrongIds, s.questions[s.currentIndex].id];
      return {
        ...s,
        isAnswered: true,
        selectedAnswer: answerLabel,
        score: correct ? s.score + 1 : s.score,
        wrongIds: newWrong,
        showHint: !correct,
      };
    });
  }

  // ── Public actions ──────────────────────────────────────────────────────────
  const selectMcq = useCallback((idx: number) => {
    if (state.isAnswered) return;
    const correct = idx === current.mappedCorrectIndex;
    _recordAnswer(correct, String(idx));
  }, [state.isAnswered, current]);

  const setFillInput = useCallback((v: string) => {
    setState(s => ({ ...s, fillInput: v }));
  }, []);

  const submitFill = useCallback(() => {
    if (state.isAnswered) return;
    const expected = current.answer?.trim().toLowerCase() ?? '';
    const given = state.fillInput.trim().toLowerCase();
    _recordAnswer(given === expected, given);
  }, [state.isAnswered, state.fillInput, current]);

  const setMatchSelection = useCallback((left: string, right: string) => {
    setState(s => ({ ...s, matchSelections: { ...s.matchSelections, [left]: right } }));
  }, []);

  const submitMatch = useCallback(() => {
    if (state.isAnswered) return;
    const pairs = current.pairs ?? [];
    const allCorrect = pairs.every(p => state.matchSelections[p.left] === p.right);
    _recordAnswer(allCorrect, JSON.stringify(state.matchSelections));
  }, [state.isAnswered, state.matchSelections, current]);

  const moveSequenceItem = useCallback((from: number, to: number) => {
    setState(s => {
      const arr = [...s.sequenceOrder];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...s, sequenceOrder: arr };
    });
  }, []);

  const submitSequence = useCallback(() => {
    if (state.isAnswered) return;
    const correct = JSON.stringify(state.sequenceOrder) === JSON.stringify(current.sequence);
    _recordAnswer(correct, JSON.stringify(state.sequenceOrder));
  }, [state.isAnswered, state.sequenceOrder, current]);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const nextIdx = s.currentIndex + 1;
      if (nextIdx >= s.questions.length) {
        // Quiz finished — call onComplete after render
        return { ...s };
      }
      const nextQ = s.questions[nextIdx];
      return {
        ...s,
        currentIndex: nextIdx,
        selectedAnswer: null,
        isAnswered: false,
        showHint: false,
        timeLeft: SECONDS_PER_Q,
        matchSelections: {},
        fillInput: '',
        sequenceOrder: nextQ.type === 'sequence' ? (nextQ.shuffledSequence ?? []) : [],
      };
    });
  }, []);

  // Trigger onComplete when quiz ends
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (state.isAnswered && state.currentIndex === state.questions.length - 1) {
      const delay = state.wrongIds.includes(current?.id ?? '') ? 3200 : 1800;
      t = setTimeout(() => {
        onComplete?.(state.score, state.questions.length, state.wrongIds);
      }, delay);
    }
    return () => clearTimeout(t);
  }, [state.isAnswered, state.currentIndex, state.questions.length]);

  const dismissAntiCheat = useCallback(() => {
    setState(s => ({ ...s, antiCheatTriggered: false }));
  }, []);

  return { state, current, actions: { selectMcq, setFillInput, submitFill, setMatchSelection, submitMatch, moveSequenceItem, submitSequence, nextQuestion, dismissAntiCheat } };
}
