import { GoogleGenAI } from '@google/genai';

/**
 * Obtém sugestões da IA do Google Gemini.
 * A instância é criada no momento da chamada para garantir que utilize 
 * a chave de API mais recente disponível no ambiente (process.env.API_KEY).
 */
export const getSuggestions = async (prompt: string): Promise<string> => {
  // Sempre use a chave do ambiente process.env.API_KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Chave da API não configurada. Se estiver no celular, clique no botão 'Ativar IA' no topo do aplicativo.");
  }

  // Cria uma nova instância a cada chamada para garantir que o SDK pegue a chave atualizada
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Modelo recomendado para tarefas de texto
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("A IA retornou uma resposta sem conteúdo de texto.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);

    // Se o erro for relacionado à entidade não encontrada, resetamos a percepção de chave ativa
    if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("API key")) {
      throw new Error("Erro de autenticação: A chave selecionada é inválida ou o projeto não foi encontrado. Tente selecionar a chave novamente.");
    }

    let errorMessage = "Falha ao obter sugestões da IA. Por favor, tente novamente.";
    if (error instanceof Error) {
        if (error.message.includes("500") || error.message.includes("Rpc failed")) {
            errorMessage = "Erro temporário no servidor de IA. Tente novamente em instantes.";
        }
    }
    
    throw new Error(errorMessage);
  }
};