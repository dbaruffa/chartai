import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./prompts"

const GEMINI_KEY = import.meta.env.VITE_GEMINI_PUBLIC_KEY;

if (!GEMINI_KEY) {
  throw new Error("Missing gemini key");
}


const ai = new GoogleGenAI({apiKey: GEMINI_KEY});

const modelConfig = {
    safetySettings: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_LOW_AND_ABOVE",
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_LOW_AND_ABOVE",
        },
    ],
    ...(systemPrompt != null? {
        systemInstruction: systemPrompt
    } : { })
};

export { ai, modelConfig };
