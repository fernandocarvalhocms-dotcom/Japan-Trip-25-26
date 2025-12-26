
import React, { useState, useEffect, useRef } from 'react';
import { ItineraryView } from './components/ItineraryView';
import { ChecklistView } from './components/ChecklistView';
import { MapViewWrapper } from './components/MapViewWrapper';
import { HotelsView } from './components/HotelsView';
import { CalendarView } from './components/CalendarView';
import { ItineraryIcon, ChecklistIcon, ShareIcon, SunIcon, MoonIcon, MapIcon, HotelIcon, CalendarIcon, DownloadIcon, UploadIcon } from './components/icons';

type View = 'roteiro' | 'checklist' | 'mapa' | 'hoteis' | 'calendario';
type Theme = 'light' | 'dark';

const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'light';
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, toggleTheme];
};

function App() {
    const [theme, toggleTheme] = useTheme();
    const [activeView, setActiveView] = useState<View>('roteiro');
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Monitoramento robusto da Chave de API
    useEffect(() => {
        const checkStatus = () => {
            const key = process.env.API_KEY;
            const isValid = !!(key && key !== "undefined" && key.length > 5);
            if (isValid !== hasApiKey) {
                setHasApiKey(isValid);
            }
        };
        
        checkStatus();
        // Polling para mobile: a injeção da chave pode ocorrer a qualquer momento após o diálogo
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [hasApiKey]);

    const handleOpenKeyDialog = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio && typeof aistudio.openSelectKey === 'function') {
            try {
                await aistudio.openSelectKey();
                // Assumimos sucesso imediatamente conforme diretriz para evitar race conditions
                setHasApiKey(true);
            } catch (err) {
                console.error("Erro ao abrir seletor de chaves:", err);
            }
        }
    };

    const handleShare = async () => {
        const shareData = { title: 'Roteiro Japão 2025-26', url: window.location.href };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (e) {}
        }
    };

    const NavButton: React.FC<{ view: View; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeView === view 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300 flex flex-col selection:bg-red-100 selection:text-red-900">
            <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4">
                <div className="container mx-auto flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                            <span className="text-white font-black text-lg">JP</span>
                        </div>
                        <h1 className="text-lg font-extrabold tracking-tighter hidden md:block">ROTEIRO JAPÃO</h1>
                    </div>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="mapa" label="Mapas"><MapIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="hoteis" label="Hotéis"><HotelIcon className="w-5 h-5" /></NavButton>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

                        {!hasApiKey && (
                            <button 
                                onClick={handleOpenKeyDialog}
                                className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-3 py-2 rounded-full shadow-lg animate-pulse uppercase tracking-tighter transition-all"
                                title="Ative a IA para obter dicas personalizadas"
                            >
                                Ativar IA ✨
                            </button>
                        )}

                        <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                    </nav>
                </div>
            </header>
            
            <main className="container mx-auto flex-1 h-[calc(100vh-4rem)] overflow-hidden">
                {activeView === 'roteiro' && <ItineraryView />}
                {activeView === 'checklist' && <ChecklistView />}
                {activeView === 'mapa' && <MapViewWrapper />}
                {activeView === 'hoteis' && <HotelsView />}
                {activeView === 'calendario' && <CalendarView onNavigateToDay={() => setActiveView('roteiro')} />}
            </main>
            
            <footer className="md:hidden bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-2 text-[10px] text-center text-slate-400">
                Japan Trip Itinerary - 2025/26
            </footer>
        </div>
    );
}

export default App;
