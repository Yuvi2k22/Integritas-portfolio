import { GoogleGenAI } from '@google/genai';

export function getGeminiClient() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
  return ai;
}