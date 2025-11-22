
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ItineraryEvent } from '../types';
import { ActivityIcon, getColorClassName, CloseIcon } from './icons';

interface MapViewProps {
  events: ItineraryEvent[];
}

// Coordenadas ajustadas para o mapa "Japan location map.svg" da Wikimedia
// Usaremos a versão PNG para garantir renderização
// Bounds aproximados: N: 45.5, S: 30.0, W: 128.0, E: 149.0
const MAP_BOUNDS = {
  top: 45.8,
  bottom: 29.8,
  left: 128.0,
  right: 149.0,
};

const getProjectedCoords = (coords: { lat: number; lng: number }) => {
  const latRange = MAP_BOUNDS.top - MAP_BOUNDS.bottom;
  const lngRange = MAP_BOUNDS.right - MAP_BOUNDS.left;
  
  // Inverter Y pois latitude cresce para cima, mas Y do CSS cresce para baixo
  const topPercent = ((MAP_BOUNDS.top - coords.lat) / latRange) * 100;
  const leftPercent = ((coords.lng - MAP_BOUNDS.left) / lngRange) * 100;
  
  return { top: topPercent, left: leftPercent };
};

const MapPin: React.FC<{ event: ItineraryEvent; isSelected: boolean; onClick: () => void; }> = ({ event, isSelected, onClick }) => {
  const { top, left } = getProjectedCoords(event.coordinates);
  const colorClass = getColorClassName(event.type);

  // Não renderizar se estiver fora do mapa visualmente
  if (top < 0 || top > 100 || left < 0 || left > 100) return null;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10 group"
      style={{ top: `${top}%`, left: `${left}%` }}
      title={event.title}
    >
      <div className={`relative transition-all duration-300 ${isSelected ? 'scale-125 z-30' : 'group-hover:scale-110 z-10'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-md ring-2 ${isSelected ? 'ring-indigo-500' : 'ring-white'} ${colorClass}`}>
          <ActivityIcon type={event.type} className="w-3.5 h-3.5 bg-current text-white rounded-full p-0.5" />
        </div>
        {/* Pulse effect for selected */}
        {isSelected && (
           <span className="absolute -inset-1 rounded-full bg-indigo-400 opacity-30 animate-ping"></span>
        )}
        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {event.title}
        </div>
      </div>
    </button>
  );
};

const EventDetailCard: React.FC<{ event: ItineraryEvent; onClose: () => void }> = ({ event, onClose }) => (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 z-30 overflow-hidden animate-slide-up">
        <div className="p-4">
            <div className="flex justify-between items-start">
                <div className="pr-2">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-1">
                        {event.time}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">{event.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-1.5 text-xs leading-relaxed line-clamp-3">{event.description}</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition-colors flex-shrink-0">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.006.003.002.001.003.001a.79.79 0 0 0 .01.003Z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{event.location}</span>
            </div>
        </div>
        <style jsx>{`
            @keyframes slide-up {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up {
                animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>
    </div>
);

export const MapView: React.FC<MapViewProps> = ({ events }) => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const routePathRef = useRef<SVGPolylineElement>(null);
  // Usando link PNG direto da Wikimedia para maior compatibilidade
  const [imgSrc, setImgSrc] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Japan_location_map.svg/1024px-Japan_location_map.svg.png");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setSelectedEventId(null);
  }, [events]);

  const selectedEvent = useMemo(() => {
    return events.find(event => event.id === selectedEventId);
  }, [selectedEventId, events]);

  const routePoints = useMemo(() => {
    if (events.length < 2) return '';
    return events
      .map(event => {
        const { left, top } = getProjectedCoords(event.coordinates);
        // Filtrar pontos muito fora do mapa
        if (top < 0 || top > 100 || left < 0 || left > 100) return null;
        return `${left},${top}`;
      })
      .filter(point => point !== null)
      .join(' ');
  }, [events]);

  useEffect(() => {
    if (routePathRef.current) {
        const path = routePathRef.current;
        try {
            const pathLength = path.getTotalLength();
            if (pathLength > 0) {
                path.style.strokeDasharray = `${pathLength} ${pathLength}`;
                path.style.strokeDashoffset = `${pathLength}`;
            }
        } catch (e) {
            // Ignore error if path not rendered yet
        }
    }
  }, [events]);

  return (
    <div 
        className="w-full h-full flex items-center justify-center p-2 sm:p-6 bg-slate-100 dark:bg-slate-900 overflow-hidden relative" 
        onClick={() => setSelectedEventId(null)}
    >
      {/* 
         Container mantendo a proporção exata do mapa.
         Aspect Ratio ajustado para o mapa do Japão (vertical).
         Width/Height constraints garantem que ele caiba na tela.
      */}
      <div className="relative w-auto h-full max-h-full aspect-[128/149] sm:aspect-[21/16] md:aspect-[1280/1150] shadow-2xl rounded-xl overflow-hidden bg-blue-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
           style={{ aspectRatio: '21/16' }} // Forçando aspect ratio via style para garantir
      >
        
        {/* Fallback Background Pattern se a imagem falhar */}
        <div className="absolute inset-0 bg-blue-100 dark:bg-slate-800 opacity-100 flex items-center justify-center">
            {imageError && (
                <span className="text-xs text-slate-400">Mapa indisponível</span>
            )}
        </div>

        <img 
            src={imgSrc}
            alt="Mapa do Japão"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
            style={{ display: imageError ? 'none' : 'block' }}
        />

        {/* SVG Overlay for Route Lines */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 z-0 pointer-events-none">
          <defs>
             <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="black" floodOpacity="0.3"/>
            </filter>
          </defs>
          <polyline
            ref={routePathRef}
            key={routePoints}
            points={routePoints}
            fill="none"
            stroke="#6366f1" // Indigo-500
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="route-path drop-shadow-sm"
            style={{ filter: 'url(#shadow)' }}
          />
           <style jsx>{`
                .route-path {
                    animation: draw-line 2.5s ease-out forwards;
                }
                @keyframes draw-line {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </svg>

        {/* Pins */}
        {events.map(event => (
          <MapPin
            key={event.id}
            event={event}
            isSelected={event.id === selectedEventId}
            onClick={() => setSelectedEventId(event.id)}
          />
        ))}

        {/* Attribution */}
        <div className="absolute bottom-1 right-2 text-[9px] text-slate-500 dark:text-slate-400 opacity-60 bg-white/50 px-1 rounded">
            Map: Wikimedia Commons
        </div>
      </div>

      {/* Floating Header */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-2 px-4 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 z-20 pointer-events-none">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Roteiro Geral
          </h3>
      </div>

      {selectedEvent && <EventDetailCard event={selectedEvent} onClose={() => setSelectedEventId(null)} />}
    </div>
  );
};
