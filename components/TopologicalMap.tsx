
import React, { useState, useRef, useEffect } from 'react';
import { MapArea, MapNode, LabelPosition } from '../types';
import { CloseIcon } from './icons';

interface TopologicalMapProps {
  area: MapArea;
}

// Definição centralizada dos estilos e legendas
const NODE_STYLES: Record<string, { bg: string; ring: string; label: string; dotColor: string }> = {
  station: { 
    bg: 'bg-slate-800 dark:bg-slate-200', 
    ring: 'ring-slate-400', 
    label: 'Estação / Metrô',
    dotColor: 'bg-slate-800 dark:bg-slate-200'
  },
  landmark: { 
    bg: 'bg-red-500', 
    ring: 'ring-red-300', 
    label: 'Atração Turística',
    dotColor: 'bg-red-500'
  },
  spot: { 
    bg: 'bg-red-500', 
    ring: 'ring-red-300', 
    label: 'Atração Turística',
    dotColor: 'bg-red-500'
  },
  shop: { 
    bg: 'bg-blue-500', 
    ring: 'ring-blue-300', 
    label: 'Compras',
    dotColor: 'bg-blue-500'
  },
  food: { 
    bg: 'bg-orange-500', 
    ring: 'ring-orange-300', 
    label: 'Gastronomia',
    dotColor: 'bg-orange-500'
  },
  activity: { 
    bg: 'bg-purple-500', 
    ring: 'ring-purple-300', 
    label: 'Atividade / Lazer',
    dotColor: 'bg-purple-500'
  },
};

const MapLegend: React.FC = () => {
  const legendItems = [
    { type: 'station', ...NODE_STYLES.station },
    { type: 'landmark', ...NODE_STYLES.landmark },
    { type: 'shop', ...NODE_STYLES.shop },
    { type: 'food', ...NODE_STYLES.food },
    { type: 'activity', ...NODE_STYLES.activity },
  ];

  return (
    <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 max-w-[160px] sm:max-w-none">
      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Legenda</h4>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.dotColor} shadow-sm`}></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NodeMarker: React.FC<{ 
  node: MapNode; 
  isSelected: boolean; 
  onClick: () => void; 
}> = ({ node, isSelected, onClick }) => {
  
  const style = NODE_STYLES[node.type] || NODE_STYLES.landmark;
  const labelPos = node.labelPos || 'top';

  // Configuração de posicionamento baseada na propriedade labelPos
  const getPositionClasses = (pos: LabelPosition) => {
    switch (pos) {
      case 'bottom':
        return {
          container: 'top-full mt-3 left-1/2 -translate-x-1/2',
          arrow: '-top-1 left-1/2 -translate-x-1/2 border-t border-l bg-white dark:bg-slate-800'
        };
      case 'left':
        return {
          container: 'right-full mr-3 top-1/2 -translate-y-1/2',
          arrow: '-right-1 top-1/2 -translate-y-1/2 border-t border-r bg-white dark:bg-slate-800'
        };
      case 'right':
        return {
          container: 'left-full ml-3 top-1/2 -translate-y-1/2',
          arrow: '-left-1 top-1/2 -translate-y-1/2 border-b border-l bg-white dark:bg-slate-800'
        };
      case 'top':
      default:
        return {
          container: 'bottom-full mb-3 left-1/2 -translate-x-1/2',
          arrow: '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r bg-white dark:bg-slate-800'
        };
    }
  };

  const posClasses = getPositionClasses(labelPos);

  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${isSelected ? 'z-50' : 'z-20 hover:z-40'}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      {/* Label */}
      <div 
        className={`
          absolute whitespace-nowrap px-2.5 py-1 
          bg-white dark:bg-slate-800 rounded-md shadow-md border border-slate-200 dark:border-slate-600 
          text-xs font-bold text-slate-800 dark:text-slate-100 pointer-events-none 
          transition-all duration-200
          ${posClasses.container}
          ${isSelected ? 'opacity-100 scale-110 ring-2 ring-indigo-400 dark:ring-indigo-500' : 'opacity-100 lg:opacity-100'}
        `}
      >
        {node.label}
        {/* Seta do tooltip */}
        <div className={`absolute w-2 h-2 rotate-45 border-slate-200 dark:border-slate-600 ${posClasses.arrow}`}></div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`
          w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center 
          ${style.bg} 
          ${isSelected ? `ring-4 ${style.ring} scale-125` : 'ring-2 ring-white dark:ring-slate-800 hover:scale-125 hover:ring-4 ' + style.ring}
        `}
      >
        {node.type === 'station' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white dark:bg-slate-800 rounded-sm" />}
      </button>
    </div>
  );
};

const DetailPanel: React.FC<{ node: MapNode; onClose: () => void }> = ({ node, onClose }) => {
  const style = NODE_STYLES[node.type] || NODE_STYLES.landmark;

  return (
    <div className="absolute z-50 
      bottom-4 left-4 right-4 
      md:bottom-6 md:left-6 md:right-auto md:top-auto md:w-80 lg:w-96
      bg-white/95 dark:bg-slate-800/95 backdrop-blur-md 
      p-5 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 
      animate-fade-in flex flex-col"
      style={{ maxHeight: '60vh' }}
    >
      <div className="flex justify-between items-start mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${style.dotColor}`}></div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">{style.label}</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{node.label}</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">{node.description}</p>
        {node.tips && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border-l-4 border-amber-400">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-500 mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
              </svg>
              Dica Local
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{node.tips}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const TopologicalMap: React.FC<TopologicalMapProps> = ({ area }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setSelectedNodeId(null);
  }, [area]);

  const getNode = (id: string) => area.nodes.find(n => n.id === id);

  return (
    <div className="relative w-full h-full bg-slate-100 dark:bg-slate-900 overflow-hidden select-none font-sans" onClick={() => setSelectedNodeId(null)}>
      
      {/* Header Title (Left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none hidden md:block">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 drop-shadow-sm tracking-tight">{area.title}</h2>
      </div>

      {/* Info Overlay (Right) */}
      <div className="absolute top-4 right-4 z-10 max-w-xs pointer-events-none hidden md:block">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
            {area.description}
          </p>
        </div>
        {area.generalTips && area.generalTips.length > 0 && (
          <div className="mt-2 bg-indigo-50/95 dark:bg-indigo-950/80 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50 shadow-sm pointer-events-auto">
             <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase mb-1.5">Dicas Gerais</h4>
             <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                {area.generalTips.map((tip, idx) => <li key={idx} className="leading-tight">{tip}</li>)}
             </ul>
          </div>
        )}
      </div>

      {/* Mobile Header (Simplified) */}
       <div className="absolute top-0 left-0 right-0 p-4 z-10 md:hidden bg-gradient-to-b from-slate-100/90 to-transparent dark:from-slate-900/90 pointer-events-none">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 drop-shadow-sm">{area.title}</h2>
       </div>

      {/* SVG Graph */}
      <svg 
        ref={svgRef}
        className="w-full h-full absolute inset-0 z-0"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Edges */}
        {area.edges.map((edge, i) => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);
          if (!from || !to) return null;

          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              {/* Edge Line */}
              <line 
                x1={`${from.x}%`} y1={`${from.y}%`} 
                x2={`${to.x}%`} y2={`${to.y}%`} 
                stroke="currentColor" 
                className="text-slate-300 dark:text-slate-600"
                strokeWidth="2"
                strokeDasharray="4"
              />
              
              {/* Time Label Badge */}
              {edge.label && (
                <g>
                   <rect 
                      x={`${(from.x + to.x) / 2}%`} 
                      y={`${(from.y + to.y) / 2}%`} 
                      width="44" height="18" 
                      rx="6" 
                      transform={`translate(-22, -9)`}
                      className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600"
                      strokeWidth="1"
                   />
                   <text 
                      x={`${(from.x + to.x) / 2}%`} 
                      y={`${(from.y + to.y) / 2}%`} 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400"
                   >
                     {edge.label}
                   </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {area.nodes.map(node => (
        <NodeMarker 
          key={node.id} 
          node={node} 
          isSelected={selectedNodeId === node.id} 
          onClick={() => setSelectedNodeId(node.id)} 
        />
      ))}

      {/* Detail Panel (Popup) */}
      {selectedNodeId && getNode(selectedNodeId) && (
        <DetailPanel 
          node={getNode(selectedNodeId)!} 
          onClose={() => setSelectedNodeId(null)} 
        />
      )}

      {/* Legend */}
      <MapLegend />

    </div>
  );
};
