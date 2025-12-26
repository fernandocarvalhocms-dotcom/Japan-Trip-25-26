import React, { useState, useEffect, useRef } from 'react';
import { ItineraryView } from './components/ItineraryView';
import { ChecklistView } from './components/ChecklistView';
import { MapViewWrapper } from './components/MapViewWrapper';
import { HotelsView } from './components/HotelsView';
import { CalendarView } from './components/CalendarView';
import { ItineraryIcon, ChecklistIcon, ShareIcon, SunIcon, MoonIcon, MapIcon, HotelIcon, CalendarIcon, DownloadIcon, UploadIcon } from './components/icons';

type View = 'roteiro' | 'checklist' | 'mapa' | 'hoteis' | 'calendario';
type Theme = 'light' | 'dark';

// Tipagem para os métodos injetados pelo ambiente do AI Studio
// Fix: Definindo a interface AIStudio explicitamente para resolver conflitos de declaração global e modifiers idênticos.
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

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
    const [activeView, setActiveView] = useState<View>('roteiro');
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
    const [hasApiKey, setHasApiKey] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Verifica o status da chave de API ao carregar o app para habilitar IA
    useEffect(() => {
        const checkApiKeyStatus = async () => {
            // Se já existe no ambiente (desktop), está ok
            if (process.env.API_KEY) {
                setHasApiKey(true);
                return;
            }
            
            // Caso contrário, checa se o usuário já selecionou uma chave no ambiente do AI Studio
            if (window.aistudio) {
                try {
                    const selected = await window.aistudio.hasSelectedApiKey();
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
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                // Assume sucesso para liberar a UI imediatamente (mitigar race conditions)
                setHasApiKey(true);
            } catch (err) {
                console.error("Erro ao abrir seletor de chave:", err);
            }
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
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
                console.error("Web Share API error:", err);
                if (err instanceof Error && err.name === 'AbortError') {
                    // User cancelled
                } else {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const handleExportData = () => {
        const dataToExport: Record<string, any> = {};
        
        // Collect specific keys
        const keysToSave = ['japanTripChecklistData', 'japanTripChecklistChecked', 'japanTripHotels', 'theme'];
        keysToSave.forEach(key => {
            const val = localStorage.getItem(key);
            if (val) dataToExport[key] = JSON.parse(val);
        });

        // Collect AI Suggestions
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ai_suggestion_')) {
                dataToExport[key] = localStorage.getItem(key);
            }
        }

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `japan-trip-data-${new Date().toISOString().split('T')[0]}.json`;
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
                    if (typeof value === 'object') {
                        localStorage.setItem(key, JSON.stringify(value));
                    } else {
                        localStorage.setItem(key, value);
                    }
                });
                
                alert('Dados importados com sucesso! A página será recarregada.');
                window.location.reload();
            } catch (error) {
                console.error('Erro ao importar JSON:', error);
                alert('Arquivo inválido. Certifique-se de importar um arquivo JSON gerado por este aplicativo.');
            }
        };
        reader.readAsText(file);
    };

    const handleDayNavigation = (dayId: number) => {
        setActiveView('roteiro');
        // Use simple timeout to allow React to render the view before scrolling
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
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeView === view ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-current={activeView === view ? 'page' : undefined}
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
                            <img src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png" alt="Japan Castle Icon" className="w-8 h-8" />
                            <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 hidden md:block">Roteiro Japão</h1>
                        </div>
                        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            <NavButton view="roteiro" label="Roteiro">
                                <ItineraryIcon className="w-5 h-5" />
                            </NavButton>
                            <NavButton view="mapa" label="Mapa">
                                <MapIcon className="w-5 h-5" />
                            </NavButton>
                            <NavButton view="calendario" label="Calendário">
                                <CalendarIcon className="w-5 h-5" />
                            </NavButton>
                            <NavButton view="hoteis" label="Hotéis">
                                <HotelIcon className="w-5 h-5" />
                            </NavButton>
                            <NavButton view="checklist" label="Checklist">
                                <ChecklistIcon className="w-5 h-5" />
                            </NavButton>
                            
                             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                             
                            {/* Botão de Ativação de IA (Aparece apenas se a chave estiver ausente) */}
                            {!hasApiKey && (
                                <button 
                                    onClick={handleOpenKeyDialog}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800 animate-pulse whitespace-nowrap"
                                >
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Ativar IA ✨
                                </button>
                            )}

                            {/* Data Management Buttons */}
                            <button onClick={handleExportData} className="hidden sm:flex p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" title="Salvar Dados (Backup)">
                                <DownloadIcon className="w-5 h-5" />
                            </button>
                            <button onClick={handleImportClick} className="hidden sm:flex p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" title="Importar Dados">
                                <UploadIcon className="w-5 h-5" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />

                            <button
                                onClick={handleShare}
                                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                title="Compartilhar Roteiro"
                            >
                                {shareStatus === 'copied' ? (
                                    <span className="text-indigo-600 dark:text-indigo-400">Copiado!</span>
                                ) : (
                                    <>
                                        <ShareIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <button onClick={toggleTheme} className="ml-1 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" title="Alternar tema">
                                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            </button>
                        </nav>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto flex-1">
                <div className="h-[calc(100vh-4rem)]">
                    {activeView === 'roteiro' && <ItineraryView />}
                    {activeView === 'checklist' && <ChecklistView />}
                    {activeView === 'mapa' && <MapViewWrapper />}
                    {activeView === 'hoteis' && <HotelsView />}
                    {activeView === 'calendario' && <CalendarView onNavigateToDay={handleDayNavigation} />}
                </div>
            </main>
        </div>
    );
}

export default App;