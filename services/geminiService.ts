
import { GoogleGenAI } from "@google/genai";

/**
 * Função principal para obter dicas da IA.
 * Não armazena a instância da IA para garantir que sempre use a chave mais recente.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // A chave é injetada pelo ambiente após a seleção no diálogo
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error("AUTH_REQUIRED");
  }

  try {
    // Criamos a instância aqui, exatamente antes de usar
    const genAI = new GoogleGenAI({ apiKey });
    
    const response = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia");

    return text;
  } catch (error: any) {
    console.error("Erro na chamada Gemini:", error);
    
    // Se a chave for inválida ou o projeto não existir, pedimos nova autenticação
    if (
      error?.message?.includes("not found") || 
      error?.message?.includes("API key") ||
      error?.message?.includes("404")
    ) {
      throw new Error("AUTH_REQUIRED");
    }
    
    throw new Error("Erro de conexão. Tente novamente em instantes.");
  }
};
