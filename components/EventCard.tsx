
import React, { useState, useEffect } from 'react';
import { ItineraryEvent } from '../types';
import { ActivityIcon, getColorClassName } from './icons';
import { getSuggestions } from '../services/geminiService';

interface EventCardProps {
  event: ItineraryEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const storageKey = `jap_tips_v4_${event.id}`;
  const [tips, setTips] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setTips(saved);
  }, [storageKey]);

  const handleAskAi = async () => {
    if (loading || tips) return;
    
    setLoading(true);
    setError(null);

    const prompt = `Dê 3 dicas curtas e essenciais para "${event.title}" em ${event.location}: transporte prático, o que comer perto e uma curiosidade cultural rápida. Use Markdown simples, em português.`;

    try {
      const result = await getSuggestions(prompt);
      setTips(result);
      localStorage.setItem(storageKey, result);
    } catch (err: any) {
      if (err.message === "AUTH_REQUIRED") {
        const aistudio = (window as any).aistudio;
        if (aistudio?.openSelectKey) {
            await aistudio.openSelectKey();
            setError("Chave ativada! Clique no botão de novo.");
        } else {
            setError("Por favor, ative a IA no ícone ✨ do topo.");
        }
      } else {
        setError("Erro temporário. Tente novamente.");
      }
    } finally {
      setLoading(false);
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

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden active:ring-2 active:ring-indigo-500/20 transition-all duration-300">
        <div className="p-4 relative">
          <button
            onClick={handleAskAi}
            disabled={loading || !!tips}
            className={`absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all shadow-sm
              ${tips 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-90'
              } disabled:opacity-80`}
          >
            {loading ? '...' : tips ? 'DICAS ✨' : 'IA ✨'}
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

        {(loading || error || tips) && (
          <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-4 py-3 animate-fade-in">
              {error && (
                <div className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  ⚠️ {error}
                </div>
              )}
              {tips && (
                  <div 
                    className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 text-[11px] leading-snug"
                    dangerouslySetInnerHTML={{ __html: tips.replace(/\*\*(.*?)\*\*/g, '<b class="text-indigo-600 dark:text-indigo-400">$1</b>').replace(/\n/g, '<br />') }}
                  />
              )}
              {loading && (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] font-black animate-pulse">
                  <span>✨ BUSCANDO DICAS...</span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
