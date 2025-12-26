
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço de IA otimizado para funcionamento mobile e JIT (Just-In-Time).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  // Se não houver chave, lançamos um erro específico que a UI capturará para abrir o seletor
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("API_KEY_REQUIRED");
  }

  try {
    // Instanciação obrigatória logo antes do uso
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia.");

    return text;
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    
    // Erros que indicam necessidade de re-seleção de chave (Paid project/Billing issues)
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
