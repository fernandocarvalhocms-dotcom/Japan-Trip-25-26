import React, { useState, useEffect, useRef } from 'react';
import { itineraryData } from '../data/itineraryData';
import { Itinerary, ItineraryDay } from '../types';
import { EventCard } from './EventCard';

const DesktopSidebar: React.FC<{ days: ItineraryDay[]; activeDayId: number; onDaySelect: (id: number) => void }> = ({ days, activeDayId, onDaySelect }) => (
    <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800">
        <div className="sticky top-16 p-6 h-full max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Seu Roteiro</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Dez 2025 - Jan 2026</p>
            <nav>
                <ul>
                    {days.map((day, index) => (
                        <li key={day.id}>
                            <a
                                href={`#day-${day.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDaySelect(day.id);
                                }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${
                                    activeDayId === day.id
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${
                                    activeDayId === day.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                    {`D${index + 1}`}
                                </span>
                                <span className="flex-1">{day.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </aside>
);

const MobileDaySelector: React.FC<{ days: ItineraryDay[]; activeDayId: number; onDaySelect: (id: number) => void }> = ({ days, activeDayId, onDaySelect }) => (
    <div className="lg:hidden sticky top-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700/60">
        <div className="p-2 overflow-x-auto whitespace-nowrap">
             <div className="flex gap-2 mobile-day-selector">
                {days.map((day, index) => (
                    <button key={day.id} onClick={() => onDaySelect(day.id)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeDayId === day.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                        Dia {index + 1}
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const DaySection: React.FC<{ day: ItineraryDay }> = ({ day }) => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleString('pt-BR', { month: 'long', day: 'numeric', timeZone: 'UTC' });
    
    return (
        <section id={`day-${day.id}`} className="mb-12 scroll-mt-20">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">{day.title}</h2>
                <p className="text-slate-500 dark:text-slate-400">{day.dayOfWeek}, {formattedDate}</p>
            </div>
            <div className="relative pl-8">
                {/* Timeline bar */}
                <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                
                <div className="space-y-8">
                    {day.events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </section>
    );
};


export const ItineraryView: React.FC = () => {
    const [itinerary] = useState<Itinerary>(itineraryData);
    const [activeDayId, setActiveDayId] = useState<number>(itineraryData[0]?.id || 0);
    const mainContentRef = useRef<HTMLElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isClickScrolling = useRef(false);

    const handleDaySelect = (id: number) => {
        isClickScrolling.current = true;
        const element = document.getElementById(`day-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // The observer will update the activeDayId naturally, but we can set it here for faster UI response.
            setActiveDayId(id); 
            setTimeout(() => {
                isClickScrolling.current = false;
            }, 1000); 
        }
    };
    
    useEffect(() => {
        const mainContent = mainContentRef.current;
        if (!mainContent) return;

        const options = {
            root: mainContent, // Use the scrolling container as the root
            rootMargin: '0px 0px -80% 0px', // Trigger when element is near the top
            threshold: 0,
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            if (isClickScrolling.current) return;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = Number(entry.target.id.split('-')[1]);
                    setActiveDayId(id);
                }
            });
        };

        observerRef.current = new IntersectionObserver(callback, options);
        const dayElements = mainContent.querySelectorAll('section[id^="day-"]');
        dayElements.forEach(el => observerRef.current?.observe(el));

        return () => {
            observerRef.current?.disconnect();
        };
    }, [itinerary]);

    const activeDayIndex = itinerary.findIndex(day => day.id === activeDayId);
    const progress = activeDayIndex >= 0 ? ((activeDayIndex + 1) / itinerary.length) * 100 : 0;

    return (
        <div className="flex h-full bg-slate-50 dark:bg-slate-900">
            <DesktopSidebar days={itinerary} activeDayId={activeDayId} onDaySelect={handleDaySelect} />
            <main ref={mainContentRef} className="flex-1 overflow-y-auto">
                <MobileDaySelector days={itinerary} activeDayId={activeDayId} onDaySelect={handleDaySelect} />
                <div className="p-4 md:p-8 lg:p-12">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-8 sticky top-[calc(4rem+1px)] lg:top-0 z-[5]">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                    {itinerary.map(day => (
                        <DaySection key={day.id} day={day} />
                    ))}
                </div>
            </main>
        </div>
    );
};