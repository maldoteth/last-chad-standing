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
