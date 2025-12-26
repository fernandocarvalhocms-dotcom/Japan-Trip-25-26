
import React, { useState, useMemo } from 'react';
import { checklistData as initialChecklistData } from '../data/checklistData';
import { ChecklistCategory, ChecklistItem as ChecklistItemType } from '../types';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {}
    };
    return [storedValue, setValue];
}

const ChecklistItem: React.FC<{ item: ChecklistItemType; isChecked: boolean; onToggle: () => void; }> = ({ item, isChecked, onToggle }) => (
    <label className="flex items-center p-4 sm:p-5 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 active:bg-slate-100">
        <div className="relative flex items-center justify-center">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onToggle}
                className="h-6 w-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 transition-all cursor-pointer"
            />
        </div>
        <span className={`ml-4 text-sm font-bold transition-all ${isChecked ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
            {item.label}
        </span>
    </label>
);

const AddItemForm: React.FC<{ onAddItem: (label: string) => void }> = ({ onAddItem }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAddItem(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/20">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Adicionar item..."
                    className="w-full pl-4 pr-12 py-3 text-sm font-bold border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-white outline-none transition-all"
                />
                <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black"
                >
                    +
                </button>
            </div>
        </form>
    );
};

const ChecklistCategoryCard: React.FC<{
    category: ChecklistCategory;
    checkedItems: Record<string | number, boolean>;
    onToggleItem: (id: string | number) => void;
    onAddItem: (categoryTitle: string, label: string) => void;
}> = ({ category, checkedItems, onToggleItem, onAddItem }) => {
    const totalItems = category.items.length;
    const checkedCount = category.items.filter(item => checkedItems[item.id]).length;
    const isCompleted = totalItems > 0 && totalItems === checkedCount;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
            <div className={`p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center ${isCompleted ? 'bg-green-50 dark:bg-green-900/10' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{category.title}</h3>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isCompleted ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    {checkedCount}/{totalItems}
                </span>
            </div>
            <div className="flex flex-col">
                {category.items.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        isChecked={!!checkedItems[item.id]}
                        onToggle={() => onToggleItem(item.id)}
                    />
                ))}
            </div>
            <AddItemForm onAddItem={(label) => onAddItem(category.title, label)} />
        </div>
    );
};

export const ChecklistView: React.FC = () => {
    const [checklist, setChecklist] = useLocalStorage<ChecklistCategory[]>('japanTripChecklistData', initialChecklistData);
    const [checkedItems, setCheckedItems] = useLocalStorage<Record<string | number, boolean>>('japanTripChecklistChecked', {});

    const handleToggleItem = (id: string | number) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddItem = (categoryTitle: string, label: string) => {
        setChecklist(prev =>
            prev.map(category => {
                if (category.title === categoryTitle) {
                    const newItem: ChecklistItemType = { id: `custom-${Date.now()}`, label };
                    return { ...category, items: [...category.items, newItem] };
                }
                return category;
            })
        );
    };

    const { total, checked } = useMemo(() => {
        let total = 0, checked = 0;
        checklist.forEach(category => {
            total += category.items.length;
            checked += category.items.filter(item => checkedItems[item.id]).length;
        });
        return { total, checked };
    }, [checklist, checkedItems]);

    const progress = total > 0 ? (checked / total) * 100 : 0;

    return (
        <div className="p-4 sm:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 min-h-full">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Preparativos</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">Sincronizado automaticamente</p>
                </header>

                <div className="mb-8 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-2 z-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Progresso Geral</span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                        <div className="bg-indigo-600 h-3 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="space-y-2">
                    {checklist.map(category => (
                        <ChecklistCategoryCard
                            key={category.title}
                            category={category}
                            checkedItems={checkedItems}
                            onToggleItem={handleToggleItem}
                            onAddItem={handleAddItem}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
