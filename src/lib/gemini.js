import { GoogleGenAI } from "@google/genai";

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
};

export { ai, modelConfig };
