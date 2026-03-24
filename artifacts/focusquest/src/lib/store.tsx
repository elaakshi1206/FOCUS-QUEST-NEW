import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGradeTheme } from './data';

export interface FocusSession {
  id: string;
  date: string;
  score: number;
  subjectId: string;
  xpEarned: number;
}

export interface GameState {
  isHydrated: boolean;
  userName: string;
  grade: number;
  focusIssue: string;
  theme: 'ocean' | 'space' | 'future';
  avatarId: string;
  xp: number;
  level: number;
  streak: number;
  completedQuests: string[];
  focusHistory: FocusSession[];
  
  // Actions
  setProfile: (name: string, grade: number, issue: string) => void;
  setAvatar: (id: string) => void;
  addXp: (amount: number) => { levelUp: boolean; newLevel: number };
  completeQuest: (questId: string, score: number, xpEarned: number, subjectId: string) => void;
  updateStreak: () => void;
  resetGame: () => void;
}

const STORAGE_KEY = 'focusquest_state_v1';

const defaultState = {
  userName: '',
  grade: 3,
  focusIssue: '',
  theme: 'ocean' as const,
  avatarId: 'c1',
  xp: 150, // Start with some XP for demo
  level: 2,
  streak: 3,
  completedQuests: [],
  focusHistory: []
};

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...defaultState, ...parsed });
      } catch (e) {
        console.error("Failed to load game state", e);
      }
    }
    setIsHydrated(true);
  }, []);

  const saveState = (newState: typeof state) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const setProfile = (userName: string, grade: number, focusIssue: string) => {
    saveState({
      ...state,
      userName,
      grade,
      focusIssue,
      theme: getGradeTheme(grade)
    });
  };

  const setAvatar = (avatarId: string) => {
    saveState({ ...state, avatarId });
  };

  const calculateLevel = (currentXp: number) => {
    // Simple scaling: Level 1=0, L2=100, L3=300, L4=600, L5=1000...
    let lvl = 1;
    let required = 100;
    let total = 0;
    while (currentXp >= total + required) {
      total += required;
      required += 100;
      lvl++;
    }
    return lvl;
  };

  const addXp = (amount: number) => {
    const newXp = state.xp + amount;
    const newLevel = calculateLevel(newXp);
    const levelUp = newLevel > state.level;

    saveState({
      ...state,
      xp: newXp,
      level: newLevel
    });

    return { levelUp, newLevel };
  };

  const completeQuest = (questId: string, score: number, xpEarned: number, subjectId: string) => {
    const newXp = state.xp + xpEarned;
    const newLevel = calculateLevel(newXp);
    
    const session: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score,
      subjectId,
      xpEarned
    };

    saveState({
      ...state,
      xp: newXp,
      level: newLevel,
      completedQuests: Array.from(new Set([...state.completedQuests, questId])),
      focusHistory: [...state.focusHistory, session].slice(-20) // Keep last 20
    });
  };

  const updateStreak = () => {
    saveState({ ...state, streak: state.streak + 1 });
  };

  const resetGame = () => {
    saveState(defaultState);
  };

  return (
    <GameContext.Provider value={{
      ...state,
      isHydrated,
      setProfile,
      setAvatar,
      addXp,
      completeQuest,
      updateStreak,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
