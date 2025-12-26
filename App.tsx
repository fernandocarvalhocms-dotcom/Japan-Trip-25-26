
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
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

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
    const [activeView, setActiveView] = useState<View>(() => {
        const saved = localStorage.getItem('active_tab');
        return (saved as View) || 'roteiro';
    });
    
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
    const [hasApiKey, setHasApiKey] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('active_tab', activeView);
    }, [activeView]);

    useEffect(() => {
        const checkApiKeyStatus = async () => {
            if (process.env.API_KEY) {
                setHasApiKey(true);
                return;
            }
            const aistudio = (window as any).aistudio;
            if (aistudio) {
                try {
                    const selected = await aistudio.hasSelectedApiKey();
                    setHasApiKey(selected);
                } catch (e) {
                    setHasApiKey(false);
                }
            } else {
                setHasApiKey(false);
            }
        };
        checkApiKeyStatus();
    }, []);

    const handleOpenKeyDialog = async () => {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            try {
                await aistudio.openSelectKey();
                setHasApiKey(true);
            } catch (err) {
                console.error("Erro ao abrir seletor de chave:", err);
            }
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Meu Roteiro de Viagem para o Japão',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    setShareStatus('copied');
                    setTimeout(() => setShareStatus('idle'), 2000);
                } catch (cErr) {}
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            } catch (cErr) {}
        }
    };

    const handleExportData = () => {
        const dataToExport: Record<string, any> = {};
        const keysToSave = ['japanTripChecklistData', 'japanTripChecklistChecked', 'japanTripHotels', 'theme', 'hotel_form_draft'];
        keysToSave.forEach(key => {
            const val = localStorage.getItem(key);
            if (val) dataToExport[key] = JSON.parse(val);
        });
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `japao-dados-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                Object.keys(json).forEach(key => {
                    const value = json[key];
                    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
                });
                window.location.reload();
            } catch (error) {
                alert('Arquivo inválido.');
            }
        };
        reader.readAsText(file);
    };

    const handleDayNavigation = (dayId: number) => {
        setActiveView('roteiro');
        setTimeout(() => {
            const element = document.getElementById(`day-${dayId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const NavButton: React.FC<{ view: View; label: string; children: React.ReactNode }> = ({ view, label, children }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 text-[10px] sm:text-sm font-bold rounded-xl transition-all ${
                activeView === view ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
        >
            {children}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 dark:text-slate-300 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-2 sm:px-4">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center gap-2 hidden lg:flex">
                            <img src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png" alt="Icon" className="w-8 h-8" />
                            <h1 className="text-sm font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Japão 25/26</h1>
                        </div>
                        
                        <nav className="flex items-center gap-1 sm:gap-2 flex-1 justify-around sm:justify-end overflow-x-auto no-scrollbar">
                            <NavButton view="roteiro" label="Roteiro"><ItineraryIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="mapa" label="Mapa"><MapIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="calendario" label="Agenda"><CalendarIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="hoteis" label="Hotéis"><HotelIcon className="w-5 h-5" /></NavButton>
                            <NavButton view="checklist" label="Checklist"><ChecklistIcon className="w-5 h-5" /></NavButton>
                        </nav>

                        <div className="flex items-center gap-1 ml-2 border-l border-slate-200 dark:border-slate-800 pl-2">
                            <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            </button>
                            <button onClick={handleShare} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <ShareIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-16">
                    {activeView === 'roteiro' && <ItineraryView />}
                    {activeView === 'checklist' && <ChecklistView />}
                    {activeView === 'mapa' && <MapViewWrapper />}
                    {activeView === 'hoteis' && <HotelsView />}
                    {activeView === 'calendario' && <CalendarView onNavigateToDay={handleDayNavigation} />}
                </div>
            </main>

            {/* Rodapé fixo para botões de ação globais no mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2 flex justify-center gap-4 lg:hidden z-40">
                 <button onClick={handleExportData} className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-slate-500">
                    <DownloadIcon className="w-5 h-5" /> Backup
                 </button>
                 <button onClick={handleImportClick} className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-slate-500">
                    <UploadIcon className="w-5 h-5" /> Importar
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            </div>
        </div>
    );
}

export default App;
