
import React, { useState, useEffect } from 'react';
import { itineraryData } from '../data/itineraryData';
import { ItineraryDay, ItineraryEvent, HotelReservation, ActivityType } from '../types';
import { ActivityIcon, CloseIcon, ChevronRightIcon, getColorClassName, HotelIcon } from './icons';

interface CalendarViewProps {
    onNavigateToDay?: (dayId: number) => void;
}

const DayDetailModal: React.FC<{ day: ItineraryDay; hotel?: HotelReservation; onClose: () => void; onGoToItinerary: (id: number) => void }> = ({ day, hotel, onClose, onGoToItinerary }) => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{day.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{formattedDate}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="p-5 overflow-y-auto">
                    {hotel && (
                        <div className="mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full text-indigo-600 dark:text-indigo-300">
                                <HotelIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold text-indigo-500 dark:text-indigo-400">Hospedagem</span>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{hotel.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                        {day.events.map(event => (
                            <div key={event.id} className="relative">
                                <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${getColorClassName(event.type).replace('text-', 'bg-')}`}></div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">{event.time}</span>
                                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">{event.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{event.description}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                        <ActivityIcon type={event.type} className="w-3 h-3" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl flex justify-end">
                    <button 
                        onClick={() => onGoToItinerary(day.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition-colors"
                    >
                        Ver no Roteiro Completo
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const CalendarMonth: React.FC<{ year: number; month: number; onSelectDay: (day: ItineraryDay) => void; hotels: HotelReservation[] }> = ({ year, month, onSelectDay, hotels }) => {
    const monthName = new Date(year, month).toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 overflow-hidden mb-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700/60 text-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize">{capitalizedMonth} {year}</h3>
            </div>
            <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-700/50 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-3 border-b border-slate-200 dark:border-slate-700/60">
                <div>DOM</div>
                <div>SEG</div>
                <div>TER</div>
                <div>QUA</div>
                <div>QUI</div>
                <div>SEX</div>
                <div>SÁB</div>
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
                {blanksArray.map(i => (
                    <div key={`blank-${i}`} className="min-h-[120px] bg-slate-50/30 dark:bg-slate-900/20 border-b border-r border-slate-100 dark:border-slate-700/30" />
                ))}
                {daysArray.map(day => {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const itineraryDay = itineraryData.find(d => d.date === dateStr);
                    
                    // Lógica para encontrar o hotel deste dia
                    // Consideramos que o usuário está no hotel se a data for >= checkIn e < checkOut
                    const activeHotel = hotels.find(h => {
                        return dateStr >= h.checkIn && dateStr < h.checkOut;
                    });

                    // Lógica de Detecção de Tipo de Dia (Prioridades)
                    
                    // 1. Troca de Cidade Base (Laranja)
                    // 04/01 (Viagem para Quioto), 06/01 (Viagem para Osaka), 10/01 (Retorno para Tóquio)
                    const isBaseMove = itineraryDay && (
                        itineraryDay.title.toLowerCase().includes('viagem para') ||
                        itineraryDay.title.toLowerCase().includes('chegada em') ||
                        itineraryDay.title.toLowerCase().includes('retorno para') ||
                        itineraryDay.events.some(e => 
                            e.title.toLowerCase().includes('check-in') || 
                            (e.type === ActivityType.TRANSPORT && e.title.toLowerCase().includes('viagem para'))
                        )
                    );

                    // 2. Bate e Volta / Passeio (Azul)
                    // 08/01 (Hiroshima), 09/01 (Kobe), 12/01 (Niigata/Esqui), 13/01 (Yokohama)
                    const isDayTrip = itineraryDay && !isBaseMove && (
                        itineraryDay.title.toLowerCase().includes('bate e volta') ||
                        itineraryDay.title.toLowerCase().includes('dia de esqui')
                    );

                    return (
                        <div 
                            key={day} 
                            onClick={() => itineraryDay && onSelectDay(itineraryDay)}
                            className={`min-h-[120px] p-2 border-b border-r relative group transition-all duration-200 flex flex-col
                                ${itineraryDay 
                                    ? 'bg-white dark:bg-slate-800 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20' 
                                    : 'bg-slate-50/30 dark:bg-slate-900/20'
                                }
                                ${isBaseMove 
                                    ? 'border-amber-400 dark:border-amber-500 border-2 shadow-[inset_0_0_8px_rgba(251,191,36,0.1)]' 
                                    : isDayTrip
                                        ? 'border-blue-400 dark:border-blue-500 border-2 shadow-[inset_0_0_8px_rgba(96,165,250,0.1)]'
                                        : 'border-slate-100 dark:border-slate-700/30'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full 
                                    ${isBaseMove 
                                        ? 'bg-amber-500 text-white' 
                                        : isDayTrip 
                                            ? 'bg-blue-500 text-white'
                                            : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                    }
                                `}>
                                    {day}
                                </span>
                                {isBaseMove && (
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter">Viagem</span>
                                )}
                                {isDayTrip && (
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Passeio</span>
                                )}
                            </div>
                            
                            {itineraryDay && (
                                <div className="space-y-1.5 flex-1">
                                     <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                                        {itineraryDay.title}
                                     </div>
                                     
                                     {/* Hotel Badge */}
                                     {activeHotel && (
                                         <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 px-1.5 py-1 rounded text-[10px] border border-indigo-100 dark:border-indigo-800/50 w-full">
                                             <HotelIcon className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                                             <span className="text-indigo-700 dark:text-indigo-300 truncate font-medium leading-none">{activeHotel.name}</span>
                                         </div>
                                     )}

                                     <div className="flex flex-wrap gap-1 mt-auto pt-1">
                                         {itineraryDay.events.map(event => (
                                             <div 
                                                key={event.id} 
                                                className={`w-1.5 h-1.5 rounded-full ${getColorClassName(event.type).replace('text-', 'bg-')}`} 
                                                title={event.title}
                                             />
                                         ))}
                                     </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigateToDay }) => {
    const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
    const [hotels, setHotels] = useState<HotelReservation[]>([]);

    // Carregar hotéis do localStorage quando a visualização montar
    useEffect(() => {
        try {
            const savedHotels = localStorage.getItem('japanTripHotels');
            if (savedHotels) {
                setHotels(JSON.parse(savedHotels));
            }
        } catch (error) {
            console.error("Failed to load hotels for calendar:", error);
        }
    }, []);

    const handleGoToItinerary = (id: number) => {
        if (onNavigateToDay) {
            onNavigateToDay(id);
        }
    };

    // Encontrar hotel selecionado para o modal
    const selectedHotel = selectedDay ? hotels.find(h => {
        const dateStr = selectedDay.date;
        return dateStr >= h.checkIn && dateStr < h.checkOut;
    }) : undefined;

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Calendário Geral</h2>
                            <div className="text-slate-500 dark:text-slate-400 mt-1 text-sm flex flex-wrap gap-3">
                                <span>Legenda:</span>
                                <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-medium">
                                    Troca de Cidade / Hotel
                                </span>
                                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 font-medium">
                                    Passeio Bate e Volta
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <CalendarMonth year={2025} month={11} onSelectDay={setSelectedDay} hotels={hotels} />
                    <CalendarMonth year={2026} month={0} onSelectDay={setSelectedDay} hotels={hotels} />
                </div>
            </div>
            
            {selectedDay && (
                <DayDetailModal 
                    day={selectedDay} 
                    hotel={selectedHotel}
                    onClose={() => setSelectedDay(null)} 
                    onGoToItinerary={handleGoToItinerary}
                />
            )}
        </div>
    );
};
