
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
    const [isAiActive, setIsAiActive] = useState<boolean>(false);

    useEffect(() => {
        const checkStatus = async () => {
            const aistudio = (window as any).aistudio;
            if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await aistudio.hasSelectedApiKey();
                setIsAiActive(hasKey);
            }
        };
        checkStatus();
        // Checagem rápida para atualizar a UI assim que o usuário seleciona a chave
        const interval = setInterval(checkStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSetupAi = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio && typeof aistudio.openSelectKey === 'function') {
            await aistudio.openSelectKey();
            // Após abrir, assumimos sucesso para liberar a UI
            setIsAiActive(true);
        } else {
            alert("Acesse pelo navegador Google para usar a IA.");
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
                        <h1 className="text-xs font-black tracking-tighter uppercase hidden sm:block">Japão 25/26</h1>
                    </div>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="mapa" label="Mapa"><MapIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>

                        {!isAiActive ? (
                            <button 
                                onClick={handleSetupAi}
                                className="ml-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black px-3 py-2 rounded-full shadow-lg animate-pulse uppercase"
                            >
                                Ativar IA ✨
                            </button>
                        ) : (
                            <div className="ml-1 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center" title="IA Pronta">
                                <span className="text-[10px]">✨</span>
                            </div>
                        )}

                        <button onClick={toggleTheme} className="ml-1 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
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
