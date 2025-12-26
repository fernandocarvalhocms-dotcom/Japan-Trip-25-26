
import { GoogleGenAI } from "@google/genai";

/**
 * Obtém sugestões da IA. 
 * Importante: A instância deve ser criada JIT (Just-In-Time) para capturar a chave ativa.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  // Verifica se a chave existe e é válida
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("AUTH_REQUIRED");
  }

  try {
    // Sempre cria uma nova instância para garantir o uso da chave atualizada
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou um texto válido.");

    return text;
  } catch (error: any) {
    console.error("Erro no Gemini Service:", error);
    
    // Erros de autenticação ou cota
    if (error?.status === 403 || error?.status === 401 || error?.message?.includes("API key")) {
      throw new Error("AUTH_REQUIRED");
    }
    
    throw new Error("Erro de conexão. Tente novamente.");
  }
};
