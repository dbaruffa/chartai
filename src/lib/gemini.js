import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY});

export default ai;
