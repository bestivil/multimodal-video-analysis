import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const minutesStr = minutes.toString().padStart(2, "0");
  const secsStr = secs.toString().padStart(2, "0");
  return `${minutesStr}:${secsStr}`;
}
