
import React, { useState, useCallback, useEffect } from 'react';
import { ItineraryEvent } from '../types';
import { ActivityIcon, getColorClassName } from './icons';
import { getSuggestions } from '../services/geminiService';

interface EventCardProps {
  event: ItineraryEvent;
}

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
    </div>
);

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const storageKey = `ai_suggestion_${event.id}`;
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setSuggestions(saved);
  }, [storageKey]);

  const handleEnhanceClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (suggestions || isLoading) return;

    setIsLoading(true);
    setError(null);

    const prompt = `Como um guia expert em turismo no Japão, forneça 3 dicas rápidas para o evento "${event.title}" em ${event.location}:
1. Dica de transporte ou acesso.
2. Sugestão de prato ou restaurante próximo.
3. Curiosidade cultural ou etiqueta local.
Responda em Markdown, sem introduções.`;

    try {
      const result = await getSuggestions(prompt);
      setSuggestions(result);
      localStorage.setItem(storageKey, result);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          try {
            await aistudio.openSelectKey();
            setError("Chave selecionada! Tente novamente.");
          } catch (e) {
            setError("Clique em 'Ativar IA' no topo.");
          }
        } else {
          setError("Chave de API não configurada.");
        }
      } else {
        setError(err?.message || "Erro na IA.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [event.title, event.location, suggestions, storageKey, isLoading]);

  const colorClass = getColorClassName(event.type);

  return (
    <div className="relative group">
      {/* Marcador da Timeline */}
      <div className={`absolute -left-[45px] top-0 h-9 w-9 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-900 z-10 shadow-sm transition-transform group-hover:scale-110`}>
          <div className={`w-full h-full rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
              <ActivityIcon type={event.type} className={`w-5 h-5 ${colorClass}`} />
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300">
        <div className="p-4 relative">
          <button
            onClick={handleEnhanceClick}
            disabled={isLoading || !!suggestions}
            className={`absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all shadow-sm
              ${suggestions 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
              } disabled:opacity-50`}
          >
            {isLoading ? <Spinner /> : suggestions ? '✨ DICAS' : '✨ IA'}
          </button>

          <div className="pr-16">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{event.time}</span>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base mt-1 leading-tight">{event.title}</h4>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-xs leading-relaxed">{event.description}</p>
          
          <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {event.location}
          </div>
        </div>

        {(isLoading || error || suggestions) && (
          <div className="bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/50 px-4 py-3 animate-fade-in">
              {error && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-[10px] font-bold">
                  <span>⚠️ {error}</span>
                </div>
              )}
              {suggestions && (
                  <div 
                    className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: suggestions.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 dark:text-indigo-400">$1</strong>').replace(/\n/g, '<br />') }}
                  />
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold animate-pulse">
                  <Spinner />
                  <span>PREPARANDO DICAS JAPONESAS...</span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
