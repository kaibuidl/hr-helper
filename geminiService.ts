
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Use direct process.env.API_KEY initialization as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTeamNames = async (count: number, theme: string = "科技、創新、未來"): Promise<string[]> => {
  // Fix: Assume process.env.API_KEY is pre-configured and accessible per guidelines
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

    // Fix: Access response.text property directly
    const data = JSON.parse(response.text || '{"names": []}');
    return data.names.length >= count ? data.names.slice(0, count) : [...data.names, ...Array.from({ length: count - data.names.length }, (_, i) => `小組 ${i + 1}`)];
  } catch (error) {
    console.error("Gemini Error:", error);
    return Array.from({ length: count }, (_, i) => `小組 ${i + 1}`);
  }
};
