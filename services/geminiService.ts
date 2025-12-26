import { GoogleGenAI } from "@google/genai";

/**
 * Obtém sugestões da IA do Google Gemini.
 * Seguindo estritamente as diretrizes:
 * 1. Instancia o GoogleGenAI apenas no momento da execução.
 * 2. Utiliza process.env.API_KEY diretamente.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("KEY_NOT_CONFIGURED");
  }

  // Cria a instância aqui para garantir que use a chave atualizada do ambiente
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("A IA não retornou conteúdo.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    
    // Tratamento de erro conforme diretrizes (Resetar e pedir nova chave se necessário)
    if (error?.message?.includes("not found") || error?.message?.includes("API key")) {
      throw new Error("KEY_NOT_CONFIGURED");
    }
    
    throw error;
  }
};