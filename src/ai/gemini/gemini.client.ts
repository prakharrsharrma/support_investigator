import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, PORT } from "../../utils/constants";

const apiKey = GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

export const gemini = new GoogleGenAI({ apiKey });
