
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialize the AI client to prevent crashes if API key is missing
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    // Vite will replace process.env.API_KEY with the value if defined in vite.config.ts
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({ apiKey });
    }
  }
  return ai;
};

export const generateTeamNames = async (count: number, theme: string = "科技、創新、未來"): Promise<string[]> => {
  try {
    const client = getAiClient();

    if (!client) {
      console.warn("Gemini API Key is missing. Using mock data.");
      return Array.from({ length: count }, (_, i) => `小組 ${i + 1}`);
    }

    const response = await client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `請根據主題「${theme}」，生成 ${count} 個富有創意且正向的中文隊名。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["names"]
        }
      }
    });

    // Handle response.text properly (it might be a function or property depending on SDK version)
    // The @google/genai SDK usually uses .text() method on the response object
    const text = typeof response.text === 'function' ? response.text() : response.text;
    const data = JSON.parse(text || '{"names": []}');

    return data.names.length >= count ? data.names.slice(0, count) : [...data.names, ...Array.from({ length: count - data.names.length }, (_, i) => `小組 ${i + 1}`)];
  } catch (error) {
    console.error("Gemini Error:", error);
    return Array.from({ length: count }, (_, i) => `小組 ${i + 1}`);
  }
};
