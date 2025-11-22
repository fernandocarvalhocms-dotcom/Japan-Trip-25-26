
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this environment, we assume the key is always present.
  console.warn("API_KEY is not set. AI features will not work.");
}

// Initialize with a check for the key to avoid creating an instance that will always fail.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getSuggestions = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("A chave da API não foi configurada. A funcionalidade de IA está desativada.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", JSON.stringify(error, null, 2));

    let errorMessage = "Falha ao obter sugestões da IA. Por favor, tente novamente mais tarde.";
    if (error instanceof Error) {
        if (error.message.includes("500") || error.message.includes("Rpc failed")) {
            errorMessage = "Ocorreu um erro temporário no servidor de IA. Por favor, tente novamente em alguns instantes.";
        } else if (error.message.includes("API key")) {
            errorMessage = "A chave da API é inválida ou não foi configurada corretamente.";
        }
    }
    
    throw new Error(errorMessage);
  }
};
