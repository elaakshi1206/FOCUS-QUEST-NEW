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
import { type RichQuestion, shuffle, getRandomQuestions, getQuestionPools } from '@/lib/questionBank';
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
  attemptCount: number;
  voiceFeedback: string | null;

  // --- Adaptive Difficulty (DDA) ---
  currentDifficulty: 1 | 2 | 3;
  correctStreak: number;
  wrongStreak: number;
  adaptiveMessage: { text: string; type: 'up' | 'down' | 'speed' } | null;
  totalQuestions: number;
}

export interface QuizActions {
  selectMcq: (idx: number) => void;
  submitFill: () => void;
  setFillInput: (v: string) => void;
  submitMatch: () => void;
  setMatchSelection: (left: string, right: string) => void;
  submitSequence: () => void;
  moveSequenceItem: (from: number, to: number) => void;
  submitVoice: (correct: boolean, isPartial: boolean, feedback: string) => void;
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
const MAX_QUESTIONS = 10;

export function useQuiz(questId: string, focusLevel = 50, onComplete?: (score: number, total: number, wrongIds: string[]) => void) {
  // A ref to store the question pools (easy, med, hard) which act as our queue
  const poolsRef = useRef<Record<1 | 2 | 3, ReturnType<typeof buildShuffled>[]>>({ 1: [], 2: [], 3: [] });
  // A ref to check if initialized so double useEffect doesn't duplicate
  const isInitialized = useRef(false);

  // Helper to pop a question from a specific difficulty pool (with fallbacks)
  const popQuestion = useCallback((targetDiff: 1 | 2 | 3): ShuffledQuestion => {
    let pool = poolsRef.current[targetDiff];
    if (pool.length > 0) return pool.pop()!;
    
    // Fallback logic if the target pool is empty
    const fallbackDiffs = targetDiff === 1 ? [2, 3] : targetDiff === 3 ? [2, 1] : [1, 3];
    for (const d of fallbackDiffs) {
      pool = poolsRef.current[d as 1 | 2 | 3];
      if (pool.length > 0) return pool.pop()!;
    }
    
    // Absolute fallback (should never occur if banks have enough questions)
    return buildShuffled({ id: `fallback_${Date.now()}`, type: 'mcq', question: 'No extra questions available.', options: ['OK'], correctIndex: 0, hint: '', difficulty: targetDiff });
  }, []);

  const [state, setState] = useState<QuizState>({
    questions: [],
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
    attemptCount: 1,
    voiceFeedback: null,
    // DDA states
    currentDifficulty: 2, // Start at medium
    correctStreak: 0,
    wrongStreak: 0,
    adaptiveMessage: null,
    totalQuestions: MAX_QUESTIONS,
  });

  // ── Session initialisation ──────────────────────────────────────────────────
  useEffect(() => {
    if (isInitialized.current) return;
    
    // Load pools from QuestionBank
    const rawPools = getQuestionPools(questId) as Record<1 | 2 | 3, RichQuestion[]>;

    // Convert into Shuffled format and store in ref
    poolsRef.current = {
      1: rawPools[1].map(buildShuffled),
      2: rawPools[2].map(buildShuffled),
      3: rawPools[3].map(buildShuffled),
    };

    // Determine initial difficulty based on focusLevel if wanted, otherwise stick to 2.
    const startDiff = focusLevel < 35 ? 1 : focusLevel > 70 ? 3 : 2;

    const firstQuestion = popQuestion(startDiff);

    setState(s => ({
      ...s,
      questions: [firstQuestion],
      currentDifficulty: startDiff,
      sequenceOrder: firstQuestion.type === 'sequence' ? (firstQuestion.shuffledSequence ?? []) : [],
    }));

    isInitialized.current = true;
  }, [questId, focusLevel, popQuestion]);

  // Expose mutable ref for timer callback to access latest isAnswered
  const answeredRef = useRef(state.isAnswered);
  answeredRef.current = state.isAnswered;

  // Current question shorthand
  const current = state.questions[state.currentIndex];

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Voice questions don't have a countdown — the mic handles timing itself
    if (!current || state.isAnswered || current.type === 'voice') return;
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
  }, [state.currentIndex, state.isAnswered, state.timeLeft, current?.type]);

  // ── Anti-cheat: window blur ───────────────────────────────────────────────
  useEffect(() => {
    const onBlur = () => {
      if (answeredRef.current) return;
      setState(s => ({
        ...s,
        selectedAnswer: null,
        isAnswered: false,
        score: Math.max(0, s.score - 5),
        timeLeft: SECONDS_PER_Q,
        showHint: false,
        antiCheatTriggered: true,
        penaltyCount: s.penaltyCount + 1,
        matchSelections: {},
        fillInput: '',
        attemptCount: 1,
        voiceFeedback: null,
      }));
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  // ── Dynamic Internal helpers ────────────────────────────────────────────────

  function _recordAnswer(correct: boolean, answerLabel: string) {
    setState(s => {
      const newWrong = correct ? s.wrongIds : [...s.wrongIds, s.questions[s.currentIndex].id];
      const timeTaken = SECONDS_PER_Q - s.timeLeft;
      
      let nextDiff = s.currentDifficulty;
      let nextCorrectStreak = correct ? s.correctStreak + 1 : 0;
      let nextWrongStreak = !correct ? s.wrongStreak + 1 : 0;
      let newMessage: QuizState['adaptiveMessage'] = null;

      // Fast response boost (answered correctly in under 5 seconds)
      if (correct && timeTaken < 5 && s.questions[s.currentIndex].type !== 'voice') {
          nextCorrectStreak += 1; // Bonus streak point for speed
          newMessage = { text: '⚡ Incredible Speed! Difficulty Boost!', type: 'speed' };
      }

      // DDA Logic: Level Up
      if (nextCorrectStreak >= 2 && nextDiff < 3) {
        nextDiff += 1;
        nextCorrectStreak = 0; // reset streak after leveling up
        newMessage = { text: '🧠 Great job! The challenge is increasing!', type: 'up' };
      } 
      else if (nextCorrectStreak >= 3 && nextDiff === 3) {
        // Just encouragement if already at max
        newMessage = { text: '🔥 Unstoppable! Max difficulty maintained!', type: 'up' };
        nextCorrectStreak = 0; 
      }

      // DDA Logic: Level Down
      if (nextWrongStreak >= 3 && nextDiff > 1) {
        nextDiff -= 1;
        nextWrongStreak = 0; // reset streak after leveling down
        newMessage = { text: '💡 Let\'s simplify this concept and try again!', type: 'down' };
      }

      return {
        ...s,
        isAnswered: true,
        selectedAnswer: answerLabel,
        score: correct ? s.score + 1 : s.score,
        wrongIds: newWrong,
        showHint: !correct,
        currentDifficulty: nextDiff as 1 | 2 | 3,
        correctStreak: nextCorrectStreak,
        wrongStreak: nextWrongStreak,
        adaptiveMessage: newMessage,
      };
    });
  }

  // ── Public actions ──────────────────────────────────────────────────────────
  const selectMcq = useCallback((idx: number) => {
    if (state.isAnswered || !current) return;
    const correct = idx === current.mappedCorrectIndex;
    _recordAnswer(correct, String(idx));
  }, [state.isAnswered, current]);

  const setFillInput = useCallback((v: string) => {
    setState(s => ({ ...s, fillInput: v }));
  }, []);

  const submitFill = useCallback(() => {
    if (state.isAnswered || !current) return;
    const expected = current.answer?.trim().toLowerCase() ?? '';
    const given = state.fillInput.trim().toLowerCase();
    _recordAnswer(given === expected, given);
  }, [state.isAnswered, state.fillInput, current]);

  const setMatchSelection = useCallback((left: string, right: string) => {
    setState(s => ({ ...s, matchSelections: { ...s.matchSelections, [left]: right } }));
  }, []);

  const submitMatch = useCallback(() => {
    if (state.isAnswered || !current) return;
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
    if (state.isAnswered || !current) return;
    const correct = JSON.stringify(state.sequenceOrder) === JSON.stringify(current.sequence);
    _recordAnswer(correct, JSON.stringify(state.sequenceOrder));
  }, [state.isAnswered, state.sequenceOrder, current]);

  const submitVoice = useCallback((correct: boolean, isPartial: boolean, feedback: string) => {
    if (state.isAnswered || !current) return;
    
    setState(s => {
      if (!correct && s.attemptCount < 2) {
        return {
          ...s,
          attemptCount: s.attemptCount + 1,
          voiceFeedback: feedback,
        };
      } else {
        const timeTaken = SECONDS_PER_Q - s.timeLeft;
        const newWrong = correct ? s.wrongIds : [...s.wrongIds, s.questions[s.currentIndex].id];
        let nextDiff = s.currentDifficulty;
        let nextCorrectStreak = correct ? s.correctStreak + 1 : 0;
        let nextWrongStreak = !correct ? s.wrongStreak + 1 : 0;
        let newMessage: QuizState['adaptiveMessage'] = null;

        if (nextCorrectStreak >= 2 && nextDiff < 3) {
          nextDiff += 1;
          nextCorrectStreak = 0;
          newMessage = { text: '🧠 Great job! The challenge is increasing!', type: 'up' };
        } 
        else if (nextWrongStreak >= 3 && nextDiff > 1) {
          nextDiff -= 1;
          nextWrongStreak = 0;
          newMessage = { text: '💡 Let\'s simplify this concept and try again!', type: 'down' };
        }

        return {
          ...s,
          isAnswered: true,
          selectedAnswer: isPartial ? 'PARTIALLY CORRECT' : (correct ? 'CORRECT' : 'INCORRECT'),
          score: correct ? s.score + 1 : s.score,
          wrongIds: newWrong,
          showHint: !correct,
          voiceFeedback: feedback,
          currentDifficulty: nextDiff as 1 | 2 | 3,
          correctStreak: nextCorrectStreak,
          wrongStreak: nextWrongStreak,
          adaptiveMessage: newMessage,
        };
      }
    });
  }, [state.isAnswered, current]);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const nextIdx = s.currentIndex + 1;
      if (nextIdx >= s.totalQuestions) {
        return { ...s };
      }
      
      const nextQ = popQuestion(s.currentDifficulty);
      const newQuestions = [...s.questions, nextQ];
      
      return {
        ...s,
        questions: newQuestions,
        currentIndex: nextIdx,
        selectedAnswer: null,
        isAnswered: false,
        showHint: false,
        timeLeft: SECONDS_PER_Q,
        matchSelections: {},
        fillInput: '',
        sequenceOrder: nextQ.type === 'sequence' ? (nextQ.shuffledSequence ?? []) : [],
        attemptCount: 1,
        voiceFeedback: null,
        adaptiveMessage: null, // Clear message on next question
      };
    });
  }, [popQuestion]);

  // Trigger onComplete when quiz ends
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (state.isAnswered && state.currentIndex === state.totalQuestions - 1) {
      const delay = state.wrongIds.includes(current?.id ?? '') ? 3200 : 1800;
      t = setTimeout(() => {
        onComplete?.(state.score, state.totalQuestions, state.wrongIds);
      }, delay);
    }
    return () => clearTimeout(t);
  }, [state.isAnswered, state.currentIndex, state.totalQuestions, current, state.score, state.wrongIds, onComplete]);

  const dismissAntiCheat = useCallback(() => {
    setState(s => ({ ...s, antiCheatTriggered: false }));
  }, []);

  return { state, current, actions: { selectMcq, setFillInput, submitFill, setMatchSelection, submitMatch, moveSequenceItem, submitSequence, submitVoice, nextQuestion, dismissAntiCheat } };
}
