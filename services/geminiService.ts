
import { GoogleGenAI } from "@google/genai";

/**
 * Busca sugestões da IA usando o modelo mais eficiente e gratuito (Gemini 3 Flash).
 * A instância é criada JIT (Just-In-Time) para garantir que use a chave ativa no navegador.
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  // Se não houver chave, informamos a UI para abrir o seletor
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    throw new Error("AUTH_REQUIRED");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou conteúdo.");

    return text;
  } catch (error: any) {
    console.error("Erro no serviço Gemini:", error);
    
    // Tratamento para chaves inválidas ou expiradas
    if (error?.message?.includes("API key not found") || error?.status === 404) {
      throw new Error("AUTH_REQUIRED");
    }
    
    throw new Error("Erro ao conectar com a IA. Verifique sua conexão.");
  }
};
