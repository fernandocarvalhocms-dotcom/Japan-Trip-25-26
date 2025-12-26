
import { GoogleGenAI } from "@google/genai";

/**
 * Função centralizada para chamadas ao Gemini.
 * Segue a regra de criar a instância GoogleGenAI imediatamente antes do uso.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Acesso direto à variável de ambiente injetada
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("API_KEY_MISSING");
  }

  try {
    // Instanciação JIT conforme diretrizes de segurança de chave
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da IA.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na integração Gemini:", error);

    // Erro específico que exige reset de chave conforme diretrizes
    if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("API key")) {
      throw new Error("API_KEY_INVALID");
    }
    
    throw error;
  }
};
