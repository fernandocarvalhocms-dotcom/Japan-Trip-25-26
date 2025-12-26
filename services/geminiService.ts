
import { GoogleGenAI } from "@google/genai";

export const getSuggestions = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("KEY_NOT_CONFIGURED");
  }

  // Instanciação no momento da chamada para garantir funcionamento com a chave injetada
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("A IA retornou uma resposta sem texto.");
    }

    return text;
  } catch (error: any) {
    if (error?.message?.includes("not found") || error?.message?.includes("API key")) {
      throw new Error("KEY_NOT_CONFIGURED");
    }
    throw error;
  }
};
