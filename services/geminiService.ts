
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço de IA otimizado para funcionamento mobile e JIT (Just-In-Time).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Acesso direto à variável injetada pelo ambiente
  const apiKey = process.env.API_KEY;

  // Se não houver chave, lançamos um erro que a UI usará para abrir o seletor
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("API_KEY_REQUIRED");
  }

  try {
    // Instanciação obrigatória logo antes do uso conforme diretrizes
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou texto.");

    return text;
  } catch (error: any) {
    console.error("Erro na chamada Gemini:", error);
    
    // Tratamento de erro para chaves inválidas ou projetos sem faturamento
    if (
      error?.message?.includes("not found") || 
      error?.message?.includes("API key") || 
      error?.status === 404
    ) {
      throw new Error("API_KEY_INVALID");
    }
    
    throw error;
  }
};
