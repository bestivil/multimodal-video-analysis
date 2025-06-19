export const CONST_PLACEHOLDER_URL = "https://www.youtube.com/watch?v=WEHZBfui8eU";

export type TranscriptResponse = {
  text: string;
  start: number;
  duration: number;
};

export const BACKEND_URL = process.env.BACKEND_URL as string;