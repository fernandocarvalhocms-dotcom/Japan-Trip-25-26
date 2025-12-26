
import React, { useState, useEffect } from 'react';
import { ItineraryEvent } from '../types';
import { ActivityIcon, getColorClassName } from './icons';
import { getSuggestions } from '../services/geminiService';

interface EventCardProps {
  event: ItineraryEvent;
}

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
);

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const storageKey = `ai_v2_${event.id}`;
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setSuggestions(saved);
  }, [storageKey]);

  const handleAiRequest = async () => {
    setIsLoading(true);
    setErrorText(null);

    const prompt = `Dê 3 dicas curtas e práticas para "${event.title}" em ${event.location}: transporte, comida e cultura. Em português.`;

    try {
      const result = await getSuggestions(prompt);
      setSuggestions(result);
      localStorage.setItem(storageKey, result);
    } catch (err: any) {
      if (err.message === "AUTH_REQUIRED") {
        const aistudio = (window as any).aistudio;
        if (aistudio?.openSelectKey) {
            await aistudio.openSelectKey();
            setErrorText("IA Conectada! Clique em IA novamente.");
        } else {
            setErrorText("Use o botão 'Habilitar IA' no topo.");
        }
      } else {
        setErrorText(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const colorClass = getColorClassName(event.type);

  return (
    <div className="relative group">
      <div className={`absolute -left-[45px] top-0 h-9 w-9 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-950 z-10 shadow-sm`}>
          <div className={`w-full h-full rounded-full flex items-center justify-center ${colorClass} bg-opacity-10`}>
              <ActivityIcon type={event.type} className={`w-5 h-5 ${colorClass}`} />
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
        <div className="p-4 relative">
          <button
            onClick={handleAiRequest}
            disabled={isLoading || !!suggestions}
            className={`absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all shadow-sm
              ${suggestions 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
              } disabled:opacity-50`}
          >
            {isLoading ? <Spinner /> : suggestions ? 'DICAS ✨' : 'IA ✨'}
          </button>

          <div className="pr-16">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{event.time}</span>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mt-0.5 leading-tight">{event.title}</h4>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-xs leading-relaxed">{event.description}</p>
          
          <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-400 font-bold uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {event.location}
          </div>
        </div>

        {(isLoading || errorText || suggestions) && (
          <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-4 py-3 animate-fade-in">
              {errorText && (
                <div className="text-amber-600 dark:text-amber-400 text-[10px] font-bold mb-1">
                  ⚠️ {errorText}
                </div>
              )}
              {suggestions && (
                  <div 
                    className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 text-[11px] leading-snug"
                    dangerouslySetInnerHTML={{ __html: suggestions.replace(/\*\*(.*?)\*\*/g, '<b class="text-indigo-600 dark:text-indigo-400">$1</b>').replace(/\n/g, '<br />') }}
                  />
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold animate-pulse">
                  <span>✨ OBTENDO DICAS...</span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
