
import { GoogleGenAI } from '@google/genai';

/**
 * Obtém sugestões da IA do Google Gemini.
 * A instância é criada no momento da chamada para garantir que utilize 
 * a chave de API mais recente disponível no ambiente (process.env.API_KEY).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Acesso direto ao process.env.API_KEY como solicitado nas diretrizes.
  // Em alguns navegadores mobile, process.env pode não estar definido globalmente,
  // então usamos uma verificação segura.
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("MISSING_API_KEY");
  }

  try {
    // Nova instância a cada chamada para capturar mudanças na chave (conforme regras)
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // .text é um getter, não um método. Não use response.text()
    const text = response.text;
    if (!text) {
      throw new Error("A IA não retornou conteúdo de texto.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);

    // Se o erro indicar que a chave é inválida ou o modelo não existe
    if (error?.message?.includes("API key") || error?.message?.includes("not found") || error?.message?.includes("404")) {
      throw new Error("MISSING_API_KEY");
    }

    throw new Error(error instanceof Error ? error.message : "Erro desconhecido na IA.");
  }
};
