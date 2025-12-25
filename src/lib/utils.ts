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
  sparse: 'sparse',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
  special: 'special'
} as const;

export type RarityType = keyof typeof RARITY_TYPES;

export function getRarityColor(rarity: string): string {
  const rarityLower = rarity?.toLowerCase() as RarityType;

  switch (rarityLower) {
    case 'common':
      return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    case 'sparse':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'rare':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'epic':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'legendary':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'special':
      return 'bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-yellow-400/30 text-white border-pink-400/60';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
}

export function getRarityFilterColor(rarity: string): string {
  const rarityLower = rarity?.toLowerCase() as RarityType;

  switch (rarityLower) {
    case 'common':
      return 'bg-gray-500';
    case 'sparse':
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
  const rarityLower = rarity?.toLowerCase() as RarityType;

  switch (rarityLower) {
    case 'common':
      return 'Common';
    case 'sparse':
      return 'Sparse';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    case 'special':
      return 'Special';
    default:
      return rarity?.charAt(0).toUpperCase() + rarity?.slice(1);
  }
}

export function getRaritySortOrder(rarity: string): number {
  const rarityLower = rarity?.toLowerCase() as RarityType;

  switch (rarityLower) {
    case 'common': return 1;
    case 'sparse': return 2;
    case 'rare': return 3;
    case 'epic': return 4;
    case 'legendary': return 5;
    case 'special': return 6;
    default: return 0;
  }
}

/**
 * Convert ISO/UTC timestamp to YYYY-MM-DD format
 * @param {string | Date} timestamp
 * @returns {string} formatted date
 */
export function formatDateToYMD(timestamp: string) {
  if (!timestamp) return "";

  const date: any = new Date(timestamp);

  if (isNaN(date)) return ""; // invalid date fallback

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


export const getTierIcon = (xp: number): string => {
  if (xp >= 10000) return '👑'; // King Chad (Level 10+)
  if (xp >= 9000) return '💪'; // Giga Chad (Level 9)
  if (xp >= 8000) return '👊'; // Chad (Level 8)
  if (xp >= 7000) return '⭐'; // Superstar (Level 7)
  if (xp >= 6000) return '🏆'; // Champ (Level 6)
  if (xp >= 5000) return '🥊'; // Pro (Level 5)
  if (xp >= 4000) return '⚔️'; // Fighter (Level 4)
  if (xp >= 3000) return '🏃'; // Athlete (Level 3)
  if (xp >= 2000) return '✊'; // Sparrer (Level 2)
  if (xp >= 1000) return '🎯'; // Trainee (Level 1)
  return '👤'; // Recruit (Level 0)
};

export const coinToUsd = 0.001

/**
 * Abbreviate a username to a maximum length with ellipsis
 * @param name - The username to abbreviate
 * @param maxLength - Maximum characters before truncation (default: 11)
 * @returns Abbreviated username with ... if truncated
 */
export function abbreviateUsername(name: string, maxLength: number = 11): string {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
}

export const CATEGORIES = [
  { id: "all", label: "All", icon: "⚫" },
  { id: "skins", label: "Fighters", icon: "👊" },
  { id: "accessories", label: "Accessories", icon: "💎" },
  { id: "mobility", label: "Mobility", icon: "🚗" },
  { id: "emotes", label: "Emotes", icon: "💃" },
  { id: "packs", label: "Packs", icon: "🎁" }
];

export const RARITIES = ["common", "sparse", "rare", "epic", "legendary", "special"];
export const generateUniqueWeb3Name =() => {
  const prefixes = [
    "Crypto", "Block", "Chain", "Token", "NFT", "DeFi", "Meta",
    "Web3", "Coin", "Smart", "Cyber", "Quantum", "Pixel",
    "Code", "Algo", "Bit", "Ether", "Game", "Tech", "Digital"
  ];

  const suffixes = [
    "King", "Master", "Warrior", "Slayer", "Champion", "Gamer",
    "Player", "Hero", "Trader", "Ninja", "Crusher", "Lord",
    "Changer", "Savvy", "Nomad", "Sage", "Builder", "Hunter",
    "Link", "Wizard", "Beast"
  ];

  // 🔹 Helper functions
  const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
  const randomNum = () => Math.floor(100 + Math.random() * 900); // 3-digit
  const randomBool = () => Math.random() > 0.5;

  // 🔹 Pick words
  const prefix = randomItem(prefixes);
  const suffix = randomItem(suffixes);

  // 🔹 Randomize order (prefix first or suffix first)
  let name = randomBool() ? `${prefix}${suffix}` : `${suffix}${prefix}`;

  // 🔹 Add random number at end
  name += randomNum();

  // 🔹 Randomly choose capital or lowercase start
  if (!randomBool()) {
    name = name.charAt(0).toLowerCase() + name.slice(1);
  }

  return name;
}
