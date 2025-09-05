import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithAbbreviation(num: number): string {
  let formatted: string;
  
  if (num >= 1000000000) {
    formatted = (num / 1000000000).toFixed(2) + 'b'
  } else if (num >= 1000000) {
    formatted = (num / 1000000).toFixed(2) + 'm'
  } else if (num >= 1000) {
    formatted = (num / 1000).toFixed(2) + 'k'
  } else {
    formatted = num.toFixed(2)
  }
  
  // Remove .00 if it exists
  return formatted.replace(/\.00([kmb]?)$/, '$1')
}

// Rarity system utilities
export const RARITY_TYPES = {
  common: 'common',
  uncommon: 'uncommon', 
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
  special: 'special'
} as const;

export type RarityType = keyof typeof RARITY_TYPES;

export function getRarityColor(rarity: string): string {
  const rarityLower = rarity.toLowerCase() as RarityType;
  
  switch (rarityLower) {
    case 'common':
      return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    case 'uncommon':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'rare':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'epic':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'legendary':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'special':
      return 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 text-transparent bg-clip-text border-pink-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
}

export function getRarityFilterColor(rarity: string): string {
  const rarityLower = rarity.toLowerCase() as RarityType;
  
  switch (rarityLower) {
    case 'common':
      return 'bg-gray-500';
    case 'uncommon':
      return 'bg-green-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-orange-500';
    case 'special':
      return 'bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

export function getRarityDisplayName(rarity: string): string {
  const rarityLower = rarity.toLowerCase() as RarityType;
  
  switch (rarityLower) {
    case 'common':
      return 'Common';
    case 'uncommon':
      return 'Uncommon';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    case 'special':
      return 'Special';
    default:
      return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  }
}

export function getRaritySortOrder(rarity: string): number {
  const rarityLower = rarity.toLowerCase() as RarityType;
  
  switch (rarityLower) {
    case 'common': return 1;
    case 'uncommon': return 2;
    case 'rare': return 3;
    case 'epic': return 4;
    case 'legendary': return 5;
    case 'special': return 6;
    default: return 0;
  }
}
