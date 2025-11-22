
import React, { useState, useMemo } from 'react';
import { itineraryData } from '../data/itineraryData';
import { mapsData } from '../data/mapsData';
import { MapView } from './MapView';
import { TopologicalMap } from './TopologicalMap';

type MapMode = 'route' | 'area';

export const MapViewWrapper: React.FC = () => {
  const [mode, setMode] = useState<MapMode>('area'); // Padrão para Área para mostrar a nova funcionalidade
  const [selectedDayId, setSelectedDayId] = useState<number | 'all'>('all');
  const [selectedAreaId, setSelectedAreaId] = useState<string>(mapsData[0].id);

  const eventsToShow = useMemo(() => {
    if (selectedDayId === 'all') {
      return itineraryData.flatMap(day => day.events);
    }
    const day = itineraryData.find(d => d.id === selectedDayId);
    return day ? day.events : [];
  }, [selectedDayId]);

  const selectedArea = useMemo(() => {
    return mapsData.find(m => m.id === selectedAreaId) || mapsData[0];
  }, [selectedAreaId]);

  return (
    <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-900">
      {/* Controls Bar */}
      <div className="p-3 sm:p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/60 z-10 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-auto">
          <button
            onClick={() => setMode('area')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'area' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            Mapas de Bairro
          </button>
           <button
            onClick={() => setMode('route')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'route' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            Roteiro Geral
          </button>
        </div>

        {/* Contextual Selects */}
        <div className="w-full sm:w-64">
          {mode === 'route' ? (
            <select
              value={selectedDayId}
              onChange={(e) => setSelectedDayId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">Todos os Dias</option>
              {itineraryData.map((day, index) => (
                  <option key={day.id} value={day.id}>
                     Dia {index + 1}: {day.title}
                  </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              {mapsData.map(area => (
                <option key={area.id} value={area.id}>{area.title}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative overflow-hidden">
         {mode === 'route' ? (
           <MapView events={eventsToShow} />
         ) : (
           <TopologicalMap area={selectedArea} />
         )}
      </div>
    </div>
  );
};
