
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço para interagir com o Google Gemini.
 * De acordo com as diretrizes, a instância deve ser criada no momento da chamada
 * para garantir o uso da chave mais recente disponível em process.env.API_KEY.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // A chave DEVE ser obtida exclusivamente de process.env.API_KEY
  const apiKey = process.env.API_KEY;

  // Verificação prévia para evitar que a SDK lance erro interno de 'API key must be set'
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("API_KEY_MISSING");
  }

  try {
    // Instanciação obrigatória seguindo o formato: new GoogleGenAI({ apiKey: ... })
    const ai = new GoogleGenAI({ apiKey });

    // Chamada direta conforme diretrizes: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // Acesso à propriedade .text (getter)
    const text = response.text;
    if (!text) {
      throw new Error("A IA retornou uma resposta sem conteúdo de texto.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na integração Gemini:", error);
    
    // Tratamento específico para erros de autenticação que sugerem nova seleção de chave
    if (error?.message?.includes("not found") || error?.message?.includes("API key")) {
      throw new Error("API_KEY_MISSING");
    }
    
    throw new Error(error instanceof Error ? error.message : "Erro desconhecido na comunicação com a IA.");
  }
};
