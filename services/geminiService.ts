import { GoogleGenAI } from '@google/genai';

/**
 * Obtém sugestões da IA do Google Gemini.
 * A instância é criada no momento da chamada para garantir que utilize 
 * a chave de API mais recente disponível no ambiente (process.env.API_KEY).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Verificação de segurança antes de instanciar a SDK
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    // Lançamos um erro específico que a UI pode capturar para abrir o seletor
    throw new Error("MISSING_API_KEY");
  }

  // Cria uma nova instância a cada chamada com a chave atualizada
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // A propriedade .text é um getter, não um método
    const text = response.text;
    if (!text) {
      throw new Error("A IA não retornou texto.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);

    if (error?.message?.includes("404") || error?.message?.includes("not found")) {
      throw new Error("Modelo não encontrado ou projeto inválido. Tente selecionar a chave novamente.");
    }

    if (error?.message?.includes("API key")) {
        throw new Error("MISSING_API_KEY");
    }

    throw new Error(error instanceof Error ? error.message : "Erro desconhecido na IA.");
  }
};