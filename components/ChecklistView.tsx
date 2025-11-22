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
            console.error(error);
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
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
}

const ChecklistItem: React.FC<{ item: ChecklistItemType; isChecked: boolean; onToggle: () => void; }> = ({ item, isChecked, onToggle }) => (
    <label htmlFor={`item-${item.id}`} className="flex items-center p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md cursor-pointer transition-colors">
        <input
            id={`item-${item.id}`}
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-transparent dark:focus:ring-offset-slate-800"
        />
        <span className={`ml-3 text-slate-700 dark:text-slate-300 ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>{item.label}</span>
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
        <form onSubmit={handleSubmit} className="p-3">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Adicionar novo item..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60">
            <div className={`p-4 border-b border-slate-200 dark:border-slate-700/60 flex justify-between items-center ${isCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{category.title}</h3>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{checkedCount} / {totalItems}</span>
            </div>
            <div className="divide-y divide-slate-200/80 dark:divide-slate-700/60">
                {category.items.map(item => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        isChecked={!!checkedItems[item.id]}
                        onToggle={() => onToggleItem(item.id)}
                    />
                ))}
            </div>
            <div className="border-t border-slate-200/80 dark:border-slate-700/60">
                <AddItemForm onAddItem={(label) => onAddItem(category.title, label)} />
            </div>
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
                    const newItem: ChecklistItemType = {
                        id: `custom-${Date.now()}`,
                        label,
                    };
                    return { ...category, items: [...category.items, newItem] };
                }
                return category;
            })
        );
    };

    const { total, checked } = useMemo(() => {
        let total = 0;
        let checked = 0;
        checklist.forEach(category => {
            total += category.items.length;
            checked += category.items.filter(item => checkedItems[item.id]).length;
        });
        return { total, checked };
    }, [checklist, checkedItems]);

    const progress = total > 0 ? (checked / total) * 100 : 0;

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Checklist da Viagem</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Itens essenciais para não esquecer. Suas seleções são salvas automaticamente.</p>
                </div>
                <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Progresso Geral</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                </div>
                <div className="space-y-6">
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