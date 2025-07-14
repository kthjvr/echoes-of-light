import { createContext, useState, useContext, ReactNode } from 'react';

type LevelStats = {
  moves: number;
  seconds: number;
};

type GameSessionContextType = {
  scores: Record<'level1' | 'level2' | 'level3', LevelStats | null>;
  setLevelStats: (level: 'level1' | 'level2' | 'level3', stats: LevelStats) => void;
  resetSession: () => void;
};

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

export const GameSessionProvider = ({ children }: { children: ReactNode }) => {
  const [scores, setScores] = useState<GameSessionContextType['scores']>({
    level1: null,
    level2: null,
    level3: null,
  });

  const setLevelStats = (level: keyof typeof scores, stats: LevelStats) => {
    setScores((prev) => ({ ...prev, [level]: stats }));
  };

  const resetSession = () => {
    setScores({
      level1: null,
      level2: null,
      level3: null,
    });
  };

  return (
    <GameSessionContext.Provider value={{ scores, setLevelStats, resetSession }}>
      {children}
    </GameSessionContext.Provider>
  );
};

export const useGameSession = () => {
  const ctx = useContext(GameSessionContext);
  if (!ctx) throw new Error("useGameSession must be used within GameSessionProvider");
  return ctx;
};
