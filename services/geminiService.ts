
import { GoogleGenAI } from "@google/genai";

/**
 * Obtém sugestões da IA. 
 * Importante: A instância deve ser criada JIT (Just-In-Time) para capturar a chave ativa.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // A chave é injetada dinamicamente pelo ambiente
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("AUTH_REQUIRED");
  }

  try {
    // Instância nova a cada chamada conforme diretrizes para garantir chave atualizada
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou conteúdo.");

    return text;
  } catch (error: any) {
    const errorMessage = error?.message || "";
    console.error("Erro Gemini:", errorMessage);
    
    // Se a entidade não for encontrada ou a chave for inválida, solicitamos nova seleção
    if (
      errorMessage.includes("not found") || 
      errorMessage.includes("API key") ||
      errorMessage.includes("403") ||
      errorMessage.includes("401")
    ) {
      throw new Error("AUTH_REQUIRED");
    }
    
    throw new Error("Erro na conexão com a IA.");
  }
};
