export interface Level {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
}

export const LEVEL_NAMES = [
  "Recruit",
  "Trainee", 
  "Sparrer",
  "Athlete",
  "Fighter",
  "Pro",
  "Champ",
  "Superstar",
  "Chad",
  "Giga Chad",
  "God Mode"
];

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 1000);
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[level] || `Level ${level}`;
}

export function getCurrentLevel(xp: number): Level {
  const level = getLevelFromXP(xp);
  const name = getLevelName(level);
  const minXp = level * 1000;
  const maxXp = (level + 1) * 1000;
  
  return { level, name, minXp, maxXp };
}

export function getProgressToNextLevel(xp: number): { current: number; total: number; percentage: number } {
  const currentLevel = getCurrentLevel(xp);
  const current = xp - currentLevel.minXp;
  const total = 1000; // Always 1000 XP per level
  const percentage = Math.min((current / total) * 100, 100);
  
  return { current, total, percentage };
}

export function getAllLevelsForDisplay(): Level[] {
  // Generate levels for display (0-20 should cover most cases)
  return Array.from({ length: 21 }, (_, index) => ({
    level: index,
    name: getLevelName(index),
    minXp: index * 1000,
    maxXp: (index + 1) * 1000
  }));
}

export function getNextLevel(xp: number): Level | null {
  const currentLevel = getCurrentLevel(xp);
  const nextLevelNumber = currentLevel.level + 1;
  const nextLevelName = getLevelName(nextLevelNumber);
  
  return {
    level: nextLevelNumber,
    name: nextLevelName,
    minXp: nextLevelNumber * 1000,
    maxXp: (nextLevelNumber + 1) * 1000
  };
}