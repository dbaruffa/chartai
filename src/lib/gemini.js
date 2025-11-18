import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./prompts"

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY});

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
