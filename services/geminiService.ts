
import { GoogleGenAI } from '@google/genai';

/**
 * Obtém sugestões da IA do Google Gemini.
 * A instância é criada no momento da chamada para garantir que utilize 
 * a chave de API mais recente disponível no ambiente (process.env.API_KEY).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Verificação rigorosa da chave antes de tocar na SDK
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "" || apiKey === "undefined") {
    // Lançamos um erro customizado que o componente sabe tratar
    throw new Error("MISSING_API_KEY");
  }

  try {
    // Só instanciamos se a chave for válida
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // .text é um getter na resposta
    const text = response.text;
    if (!text) {
      throw new Error("A IA retornou uma resposta vazia.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);

    // Se o erro for de autenticação ou modelo não encontrado
    if (error?.message?.includes("API key") || error?.message?.includes("not found") || error?.message?.includes("404")) {
      throw new Error("MISSING_API_KEY");
    }

    throw new Error(error instanceof Error ? error.message : "Erro na conexão com a IA.");
  }
};
