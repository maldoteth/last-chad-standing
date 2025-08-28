export interface Level {
  name: string;
  minXp: number;
  maxXp: number;
}

export const LEVELS: Level[] = [
  { name: "Recruit", minXp: 0, maxXp: 100 },
  { name: "Trainee", minXp: 100, maxXp: 500 },
  { name: "Sparrer", minXp: 500, maxXp: 1000 },
  { name: "Athlete", minXp: 1000, maxXp: 2000 },
  { name: "Fighter", minXp: 2000, maxXp: 4000 },
  { name: "Pro", minXp: 4000, maxXp: 7000 },
  { name: "Champ", minXp: 7000, maxXp: 10000 },
  { name: "Superstar", minXp: 10000, maxXp: 15000 },
  { name: "Chad", minXp: 15000, maxXp: 25000 },
  { name: "Giga Chad", minXp: 25000, maxXp: 50000 },
  { name: "God Mode", minXp: 50000, maxXp: Infinity },
];

export function getCurrentLevel(xp: number): Level {
  return LEVELS.find(level => xp >= level.minXp && xp < level.maxXp) || LEVELS[LEVELS.length - 1];
}

export function getProgressToNextLevel(xp: number): { current: number; total: number; percentage: number } {
  const currentLevel = getCurrentLevel(xp);
  
  if (currentLevel.maxXp === Infinity) {
    return { current: xp - currentLevel.minXp, total: 0, percentage: 100 };
  }
  
  const current = xp - currentLevel.minXp;
  const total = currentLevel.maxXp - currentLevel.minXp;
  const percentage = Math.min((current / total) * 100, 100);
  
  return { current, total, percentage };
}

export function getNextLevel(xp: number): Level | null {
  const currentLevelIndex = LEVELS.findIndex(level => xp >= level.minXp && xp < level.maxXp);
  
  if (currentLevelIndex === -1 || currentLevelIndex === LEVELS.length - 1) {
    return null;
  }
  
  return LEVELS[currentLevelIndex + 1];
}