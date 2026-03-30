import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGradeTheme } from './data';

export interface FocusSession {
  id: string;
  date: string;
  score: number;
  subjectId: string;
  xpEarned: number;
}

export interface EquipmentState {
  outfit: string;
  vehicle: string;
  accessory: string;
}

export interface UserProfile {
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
  selectedSubjects: string[];
  selectedTopics: Record<string, string[]>;
  customSubjects: string[];
  equipment: EquipmentState;
}

export interface GameState extends UserProfile {
  isHydrated: boolean;

  // Actions
  setProfile: (name: string, grade: number, issue: string) => void;
  setAvatar: (id: string) => void;
  addXp: (amount: number) => { levelUp: boolean; newLevel: number };
  completeQuest: (questId: string, score: number, xpEarned: number, subjectId: string) => void;
  updateStreak: () => void;
  resetGame: () => void;
  setSelectedSubjects: (subjects: string[]) => void;
  setSelectedTopics: (topics: Record<string, string[]>) => void;
  addCustomSubject: (subject: string) => void;
  setEquipment: (equipment: Partial<EquipmentState>) => void;
  logout: () => void;
}

// ─── Storage keys ───────────────────────────────────────────────
const PROFILES_KEY = 'focusquest_profiles_v2';
const ACTIVE_USER_KEY = 'focusquest_active_user';

// Returns all saved profiles from localStorage
export function getAllProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const map: Record<string, UserProfile> = JSON.parse(raw);
    return Object.values(map);
  } catch {
    return [];
  }
}

// Returns the key (lowercase username) for profile storage
function profileKey(name: string) {
  return name.trim().toLowerCase();
}

// ─── Default profile ─────────────────────────────────────────────
function defaultProfile(userName: string = ''): UserProfile {
  return {
    userName,
    grade: 3,
    focusIssue: '',
    theme: 'ocean',
    avatarId: 'c1',
    xp: 0,
    level: 1,
    streak: 0,
    completedQuests: [],
    focusHistory: [],
    selectedSubjects: [],
    selectedTopics: {},
    customSubjects: [],
    equipment: { outfit: 'o_outfit1', vehicle: 'o_vehicle1', accessory: 'o_acc1' },
  };
}

// ─── Context ─────────────────────────────────────────────────────
const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile());
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount: read active user from localStorage and load their profile
  useEffect(() => {
    const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeUser) {
      try {
        const raw = localStorage.getItem(PROFILES_KEY);
        if (raw) {
          const map: Record<string, UserProfile> = JSON.parse(raw);
          const saved = map[profileKey(activeUser)];
          if (saved) {
            setProfileState({ ...defaultProfile(activeUser), ...saved });
          }
        }
      } catch (e) {
        console.error('Failed to load user profile', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persist the current profile to the profiles map in localStorage
  const persist = (updater: (prev: UserProfile) => UserProfile) => {
    setProfileState(prev => {
      const next = updater(prev);
      if (!next.userName) return next; // don't save if no user
      try {
        const raw = localStorage.getItem(PROFILES_KEY);
        const map: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};
        map[profileKey(next.userName)] = next;
        localStorage.setItem(PROFILES_KEY, JSON.stringify(map));
        localStorage.setItem(ACTIVE_USER_KEY, next.userName);
      } catch (e) {
        console.error('Failed to save profile', e);
      }
      return next;
    });
  };

  const setProfile = (userName: string, grade: number, focusIssue: string) => {
    const theme = getGradeTheme(grade) as 'ocean' | 'space' | 'future';
    const defaultEquip = theme === 'ocean'
      ? { outfit: 'o_outfit1', vehicle: 'o_vehicle1', accessory: 'o_acc1' }
      : theme === 'space'
      ? { outfit: 's_outfit1', vehicle: 's_vehicle1', accessory: 's_acc1' }
      : { outfit: 'f_outfit1', vehicle: 'f_vehicle1', accessory: 'f_acc1' };
    const defaultAvatar = theme === 'future' ? 'f1' : theme === 'space' ? 's1' : 'c1';
    persist(prev => ({ ...prev, userName, grade, focusIssue, theme, equipment: defaultEquip, avatarId: defaultAvatar }));
  };

  const setAvatar = (avatarId: string) => persist(prev => ({ ...prev, avatarId }));

  const setSelectedSubjects = (selectedSubjects: string[]) =>
    persist(prev => ({ ...prev, selectedSubjects }));

  const setSelectedTopics = (selectedTopics: Record<string, string[]>) =>
    persist(prev => ({ ...prev, selectedTopics }));

  const addCustomSubject = (subject: string) => {
    persist(prev => {
      const trimmed = subject.trim();
      if (!trimmed || prev.customSubjects.includes(trimmed)) return prev;
      return { ...prev, customSubjects: [...prev.customSubjects, trimmed] };
    });
  };

  const setEquipment = (partial: Partial<EquipmentState>) =>
    persist(prev => ({ ...prev, equipment: { ...prev.equipment, ...partial } }));

  const calculateLevel = (currentXp: number) => {
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
    let levelUp = false;
    let newLevel = 1;
    persist(prev => {
      const newXp = prev.xp + amount;
      newLevel = calculateLevel(newXp);
      levelUp = newLevel > prev.level;
      return { ...prev, xp: newXp, level: newLevel };
    });
    return { levelUp, newLevel };
  };

  const completeQuest = (questId: string, score: number, xpEarned: number, subjectId: string) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score, subjectId, xpEarned
    };
    persist(prev => {
      const newXp = prev.xp + xpEarned;
      const newLevel = calculateLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedQuests: Array.from(new Set([...prev.completedQuests, questId])),
        focusHistory: [...prev.focusHistory, session].slice(-20)
      };
    });
  };

  const updateStreak = () => persist(prev => ({ ...prev, streak: prev.streak + 1 }));

  const resetGame = () => persist(() => defaultProfile(profile.userName));

  const logout = () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
    setProfileState(defaultProfile());
  };

  return (
    <GameContext.Provider value={{
      ...profile,
      isHydrated,
      setProfile,
      setAvatar,
      addXp,
      completeQuest,
      updateStreak,
      resetGame,
      setSelectedSubjects,
      setSelectedTopics,
      addCustomSubject,
      setEquipment,
      logout,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
