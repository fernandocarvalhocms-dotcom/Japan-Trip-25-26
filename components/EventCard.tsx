
import React, { useState, useCallback, useEffect } from 'react';
import { ItineraryEvent } from '../types';
import { ActivityIcon, getColorClassName } from './icons';
import { getSuggestions } from '../services/geminiService';

interface EventCardProps {
  event: ItineraryEvent;
}

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    </div>
);

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const storageKey = `ai_suggestion_${event.id}`;
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar do cache local
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSuggestions(saved);
    }
  }, [storageKey]);

  const handleEnhanceClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (suggestions) return;

    // Use process.env.API_KEY directly and cast window.aistudio to any to avoid conflicts
    const apiKey = process.env.API_KEY;
    const aistudio = (window as any).aistudio;
    
    if (!apiKey && aistudio) {
      setError("Selecione sua chave de API primeiro...");
      try {
        await aistudio.openSelectKey();
        setError(null);
        // Após abrir, o usuário precisa clicar de novo ou o app recarrega
      } catch (err) {
        setError("Não foi possível abrir o seletor de chaves.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    const prompt = `Você é um guia especializado no Japão. Dê dicas curtas e essenciais para: "${event.title}" em ${event.location}. 
1. Transporte rápido.
2. Onde comer perto ($ ou $$).
3. Uma curiosidade ou etiqueta local.
Use Markdown direto e sem introduções.`;

    try {
      const result = await getSuggestions(prompt);
      setSuggestions(result);
      localStorage.setItem(storageKey, result);
    } catch (err: any) {
      setError(err?.message || 'Erro ao conectar com a IA.');
    } finally {
      setIsLoading(false);
    }
  }, [event.title, event.location, suggestions, storageKey]);

  const colorClass = getColorClassName(event.type);

  return (
    <div className="relative">
      {/* Icone na Timeline */}
      <div className={`absolute -left-[45px] top-0 h-9 w-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center ring-4 ring-white dark:ring-slate-800`}>
          <div className={`w-full h-full rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
              <ActivityIcon type={event.type} className={`w-5 h-5 ${colorClass}`} />
          </div>
      </div>

      {/* Card Principal */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60 overflow-hidden hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
        <div className="p-4 relative">
          
          {/* Botão de IA - Posicionamento e área de toque otimizados para Mobile */}
          <button
            onClick={handleEnhanceClick}
            disabled={isLoading || !!suggestions}
            className={`absolute top-3 right-3 z-10 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all
              ${suggestions 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm disabled:opacity-50'
              }`}
          >
            {isLoading ? <Spinner /> : suggestions ? '✨ Dicas' : '✨ Melhorar'}
          </button>

          <div className="pr-20"> {/* Espaço para o botão não sobrepor o título */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{event.time}</p>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mt-0.5 leading-tight">{event.title}</h4>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm line-clamp-2 sm:line-clamp-none">{event.description}</p>
          
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {event.location}
          </div>

          {event.suggestion && (
            <div className="mt-3 bg-slate-50 dark:bg-slate-900/40 border-l-2 border-slate-300 dark:border-slate-600 p-2.5 rounded-r">
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{event.suggestion}"</p>
            </div>
          )}
        </div>

        {/* Conteúdo Gerado ou Erro */}
        {(isLoading || error || suggestions) && (
          <div className="bg-indigo-50/30 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/50 px-4 py-3 animate-fade-in">
              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs font-semibold">
                  <span>⚠️ {error}</span>
                </div>
              )}
              {suggestions && (
                  <div 
                    className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: suggestions.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}
                  />
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs animate-pulse">
                  <Spinner />
                  <span>Consultando oráculo japonês...</span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
