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

    // Checagem robusta da chave de API
    useEffect(() => {
        const checkKey = async () => {
            // Se process.env.API_KEY já estiver preenchido, temos a chave
            if (process.env.API_KEY && process.env.API_KEY !== "undefined" && process.env.API_KEY !== "") {
                setHasApiKey(true);
                return;
            }

            // Fallback para verificar via interface nativa aistudio
            const aistudio = (window as any).aistudio;
            if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
                try {
                    const selected = await aistudio.hasSelectedApiKey();
                    setHasApiKey(selected);
                } catch (e) {
                    setHasApiKey(false);
                }
            }
        };

        checkKey();
        const timer = setInterval(checkKey, 2000); // Polling para detectar ativação
        return () => clearInterval(timer);
    }, []);

    const handleOpenKeyDialog = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio && typeof aistudio.openSelectKey === 'function') {
            try {
                await aistudio.openSelectKey();
                // Assumimos sucesso conforme as diretrizes para mitigar race conditions
                setHasApiKey(true);
            } catch (err) {
                console.error("Erro ao abrir seletor de chaves:", err);
            }
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Meu Roteiro Japão', url: window.location.href });
            } catch (e) {}
        }
    };

    const NavButton: React.FC<{ view: View; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeView === view ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300 flex flex-col">
            <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4">
                <div className="container mx-auto flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-sm">JP</span>
                        </div>
                        <h1 className="text-lg font-black hidden md:block">ROTEIRO JAPÃO</h1>
                    </div>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="mapa" label="Mapas"><MapIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="hoteis" label="Hotéis"><HotelIcon className="w-5 h-5" /></NavButton>

                        {!hasApiKey && (
                            <button 
                                onClick={handleOpenKeyDialog}
                                className="ml-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-3 py-2 rounded-full shadow-lg animate-pulse uppercase tracking-tighter"
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
        </div>
    );
}

export default App;