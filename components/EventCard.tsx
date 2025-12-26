
import React, { useState, useCallback, useEffect } from 'react';
import { ItineraryEvent } from '../types';
import { ActivityIcon, getColorClassName } from './icons';
import { getSuggestions } from '../services/geminiService';

interface EventCardProps {
  event: ItineraryEvent;
}

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
    </div>
);

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const storageKey = `ai_suggestion_${event.id}`;
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSuggestions(saved);
    }
  }, [storageKey]);

  const handleEnhanceClick = useCallback(async () => {
    if (suggestions) return; // Already has content

    setIsLoading(true);
    setError(null);

    const prompt = `Você é um assistente de viagens prestativo para o Japão. Forneça dicas práticas de viagem para visitar "${event.title}" em ${event.location}. Inclua:
1.  **Transporte:** Uma rota de transporte público sugerida a partir de uma grande estação próxima (ex: Estação de Shinjuku, Estação de Quioto).
2.  **Alimentação:** Três recomendações de restaurantes próximos com tipo de culinária e uma faixa de preço aproximada (ex: $, $$, $$$).
3.  **Cultura/Dica:** Uma dica cultural local, uma regra de etiqueta ou uma sugestão de 'não perca' para este local específico.
Formate a resposta em Markdown claro e conciso, com títulos em negrito.`;

    try {
      const result = await getSuggestions(prompt);
      setSuggestions(result);
      localStorage.setItem(storageKey, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [event.title, event.location, suggestions, storageKey]);

  const colorClass = getColorClassName(event.type);

  return (
    <div className="relative">
      {/* Icon on the timeline */}
      <div className={`absolute -left-[45px] top-0 h-9 w-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center ring-4 ring-white dark:ring-slate-800`}>
          <div className={`w-full h-full rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
              <ActivityIcon type={event.type} className={`w-5 h-5 ${colorClass}`} />
          </div>
      </div>

      {/* Card content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60 overflow-hidden hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
        <div className="p-4">
          <p className={`text-sm font-semibold text-slate-500 dark:text-slate-400`}>{event.time}</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mt-1">{event.title}</h4>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{event.description}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            {event.location}
          </p>
          {event.suggestion && (
            <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-300 dark:border-indigo-600 p-3 rounded-r-md">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">{event.suggestion}</p>
            </div>
          )}
          <button
            onClick={handleEnhanceClick}
            disabled={isLoading || !!suggestions}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-default"
          >
            {isLoading ? 'Carregando...' : suggestions ? 'Dicas da IA carregadas ✨' : 'Melhorar com IA ✨'}
          </button>
        </div>
        {(isLoading || error || suggestions) && (
          <div className="bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/60 px-5 py-4 animate-fade-in">
              {isLoading && <Spinner />}
              {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-sm">{error}</p>}
              {suggestions && (
                  <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: suggestions.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}>
                  </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
