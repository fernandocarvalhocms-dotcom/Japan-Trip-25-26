
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
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkStatus = async () => {
            const key = process.env.API_KEY;
            if (key && key !== "" && key !== "undefined") {
                setHasApiKey(true);
                return;
            }

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
        checkStatus();
        const interval = setInterval(checkStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenKeyDialog = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio && typeof aistudio.openSelectKey === 'function') {
            try {
                await aistudio.openSelectKey();
                setHasApiKey(true);
            } catch (err) {
                console.error("Erro ao abrir seletor:", err);
            }
        }
    };

    const handleShare = async () => {
        const shareData = { title: 'Meu Roteiro Japão', url: window.location.href };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (e) {}
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            } catch (e) {}
        }
    };

    const NavButton: React.FC<{ view: View; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeView === view ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300 flex flex-col">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <img src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png" alt="Icon" className="w-8 h-8" />
                            <h1 className="text-lg font-bold hidden md:block">Roteiro Japão</h1>
                        </div>
                        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="mapa" label="Mapa"><MapIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="hoteis" label="Hotéis"><HotelIcon className="w-5 h-5" /></NavButton>
                            
                            {!hasApiKey && (
                                <button 
                                    onClick={handleOpenKeyDialog}
                                    className="ml-2 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black rounded-full shadow animate-pulse whitespace-nowrap uppercase tracking-tighter"
                                >
                                    Ativar IA ✨
                                </button>
                            )}

                            <button onClick={toggleTheme} className="ml-2 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            </button>
                        </nav>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto flex-1 h-[calc(100vh-4rem)]">
                {activeView === 'roteiro' && <ItineraryView />}
                {activeView === 'checklist' && <ChecklistView />}
                {activeView === 'mapa' && <MapViewWrapper />}
                {activeView === 'hoteis' && <HotelsView />}
                {activeView === 'calendario' && <CalendarView onNavigateToDay={(id) => setActiveView('roteiro')} />}
            </main>
        </div>
    );
}

export default App;
