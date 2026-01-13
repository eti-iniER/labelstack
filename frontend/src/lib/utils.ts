import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertOzToLbsOz(totalOz: number): { lbs: number; oz: number } {
  const lbs = Math.floor(totalOz / 16);
  const oz = totalOz % 16;
  return { lbs, oz };
}

export function convertLbsOzToOz(lbs: number, oz: number): number {
  return lbs * 16 + oz;
}
