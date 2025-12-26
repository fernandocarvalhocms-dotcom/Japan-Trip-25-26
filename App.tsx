
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
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);

    // Verifica a chave periodicamente para atualizar o estado da UI no mobile
    useEffect(() => {
        const checkKeyStatus = async () => {
            const keyInEnv = process.env.API_KEY;
            const isKeyPresent = !!(keyInEnv && keyInEnv !== "undefined" && keyInEnv.length > 5);
            
            if (isKeyPresent) {
                setHasApiKey(true);
            } else {
                // Tenta verificar via API do Studio se disponível
                const aistudio = (window as any).aistudio;
                if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
                    try {
                        const selected = await aistudio.hasSelectedApiKey();
                        setHasApiKey(selected);
                    } catch (e) {
                        setHasApiKey(false);
                    }
                }
            }
        };

        checkKeyStatus();
        const interval = setInterval(checkKeyStatus, 1500); // Polling agressivo para mobile
        return () => clearInterval(interval);
    }, []);

    const handleOpenKeyDialog = async () => {
        const aistudio = (window as any).aistudio;
        
        // Chamada direta sem verificações extras para evitar bloqueios de pop-up no mobile
        if (aistudio && typeof aistudio.openSelectKey === 'function') {
            try {
                await aistudio.openSelectKey();
                // Assumimos sucesso imediatamente para evitar race condition
                setHasApiKey(true);
            } catch (err) {
                console.error("Erro ao abrir seletor de chaves:", err);
                alert("Não foi possível abrir o seletor de chaves. Verifique se o app tem as permissões necessárias.");
            }
        } else {
            alert("O serviço de IA ainda está carregando ou não está disponível neste navegador.");
        }
    };

    const NavButton: React.FC<{ view: View; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeView === view ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                        <img src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png" alt="Icon" className="w-8 h-8" />
                        <h1 className="text-lg font-bold hidden md:block">ROTEIRO JAPÃO</h1>
                    </div>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="mapa" label="Mapas"><MapIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>
                        <NavButton view="hoteis" label="Hotéis"><HotelIcon className="w-5 h-5" /></NavButton>

                        {!hasApiKey && (
                            <button 
                                onClick={handleOpenKeyDialog}
                                className="ml-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-2 rounded-full shadow-lg animate-pulse uppercase tracking-tighter"
                                type="button"
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
