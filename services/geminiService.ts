
import { GoogleGenAI } from '@google/genai';

/**
 * Obtém sugestões da IA do Google Gemini.
 * A instância é criada no momento da chamada para garantir que utilize 
 * a chave de API mais recente disponível no ambiente (process.env.API_KEY).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Always create a new instance using process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the text property directly (not a method)
    const text = response.text;
    if (!text) {
      throw new Error("A IA não retornou texto.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);

    if (error?.message?.includes("404") || error?.message?.includes("not found")) {
      throw new Error("Modelo não encontrado ou chave inválida. Tente selecionar a chave novamente no botão do topo.");
    }

    throw new Error(error instanceof Error ? error.message : "Erro desconhecido na IA.");
  }
};
