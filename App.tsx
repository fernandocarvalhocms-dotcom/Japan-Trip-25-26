
import React, { useState, useEffect } from 'react';
import { ItineraryView } from './components/ItineraryView';
import { ChecklistView } from './components/ChecklistView';
import { MapViewWrapper } from './components/MapViewWrapper';
import { HotelsView } from './components/HotelsView';
import { CalendarView } from './components/CalendarView';
import { ItineraryIcon, SunIcon, MoonIcon, MapIcon, HotelIcon, CalendarIcon } from './components/icons';

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
    const [isAiReady, setIsAiReady] = useState<boolean>(false);

    // Verifica se a IA já está configurada
    useEffect(() => {
        const checkAi = async () => {
            const aistudio = (window as any).aistudio;
            if (aistudio?.hasSelectedApiKey) {
                const hasKey = await aistudio.hasSelectedApiKey();
                setIsAiReady(hasKey || !!process.env.API_KEY);
            } else {
                setIsAiReady(!!process.env.API_KEY);
            }
        };
        checkAi();
        const interval = setInterval(checkAi, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleActivateAi = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio?.openSelectKey) {
            await aistudio.openSelectKey();
            setIsAiReady(true);
        } else {
            alert("Para usar a IA no celular, acesse através do Google AI Studio.");
        }
    };

    const NavButton: React.FC<{ view: View; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === view ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
            <span className="hidden md:inline">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300 flex flex-col bg-slate-50 dark:bg-slate-950">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4">
                <div className="container mx-auto flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <img src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png" alt="Icon" className="w-7 h-7" />
                        <h1 className="text-sm font-black tracking-tighter hidden sm:block">JAPÃO 25/26</h1>
                    </div>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="mapa" label="Mapa"><MapIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>

                        {!isAiReady ? (
                            <button 
                                onClick={handleActivateAi}
                                className="ml-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-3 py-2 rounded-full shadow-lg animate-pulse uppercase"
                            >
                                Ativar IA ✨
                            </button>
                        ) : (
                            <div className="ml-1 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border border-green-200 dark:border-green-800" title="IA Ativa">
                                <span className="text-xs">✨</span>
                            </div>
                        )}

                        <button onClick={toggleTheme} className="ml-1 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                    </nav>
                </div>
            </header>
            
            <main className="container mx-auto flex-1 h-[calc(100vh-4rem)] overflow-hidden">
                {activeView === 'roteiro' && <ItineraryView />}
                {activeView === 'mapa' && <MapViewWrapper />}
                {activeView === 'hoteis' && <HotelsView />}
                {activeView === 'calendario' && <CalendarView onNavigateToDay={() => setActiveView('roteiro')} />}
            </main>
        </div>
    );
}

export default App;
