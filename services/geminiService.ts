
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço de IA configurado para ser resiliente e buscar a chave JIT (Just-In-Time).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("KEY_NOT_CONFIGURED");
  }

  try {
    // Instanciação obrigatória antes do uso para capturar a chave atualizada
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar dicas para este local.";
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    
    if (error?.message?.includes("not found") || error?.message?.includes("API key")) {
      throw new Error("KEY_NOT_CONFIGURED");
    }
    
    throw new Error("Ocorreu um erro ao conectar com a IA. Tente novamente.");
  }
};
