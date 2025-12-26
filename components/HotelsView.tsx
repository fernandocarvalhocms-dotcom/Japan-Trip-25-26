
import React, { useState, useEffect, FormEvent } from 'react';
import { HotelReservation } from '../types';
import { HotelIcon, TrashIcon, ActivityIcon } from './icons';

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

const calculateNights = (start: string, end: string): number => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return 0;
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const HotelsView: React.FC = () => {
    const [hotels, setHotels] = useLocalStorage<HotelReservation[]>('japanTripHotels', []);
    const [formData, setFormData] = useLocalStorage('hotel_form_draft', {
        name: '',
        address: '',
        checkIn: '',
        checkOut: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.checkIn || !formData.checkOut) return;

        const newHotel: HotelReservation = {
            id: Date.now().toString(),
            ...formData
        };

        const updatedHotels = [...hotels, newHotel].sort((a, b) => 
            new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
        );
        
        setHotels(updatedHotels);
        setFormData({ name: '', address: '', checkIn: '', checkOut: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        if (confirm('Deseja remover esta reserva?')) {
            setHotels(hotels.filter(h => h.id !== id));
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="p-4 sm:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 min-h-full">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <HotelIcon className="w-8 h-8 text-indigo-600" />
                        Hospedagens
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 uppercase tracking-wider">Gestão de Reservas no Japão</p>
                </header>

                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Formulário no topo no mobile para fácil acesso */}
                    <div className="order-1 lg:order-1 lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-4">
                            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-tight">Nova Reserva</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Nome do Hotel</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 text-sm border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none transition-all"
                                        placeholder="Ex: Gracery Shinjuku"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Endereço / Link</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full px-4 py-3 text-sm border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none transition-all"
                                        placeholder="Google Maps ou Endereço"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Check-in</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.checkIn}
                                            onChange={e => setFormData({...formData, checkIn: e.target.value})}
                                            className="w-full px-4 py-3 text-sm border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Check-out</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.checkOut}
                                            onChange={e => setFormData({...formData, checkOut: e.target.value})}
                                            className="w-full px-4 py-3 text-sm border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 uppercase tracking-widest"
                                >
                                    Salvar Reserva
                                </button>
                                <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-tighter">
                                    💾 Sincronizado localmente
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Hotéis */}
                    <div className="order-2 lg:order-2 lg:col-span-2 space-y-4">
                        {hotels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                                <HotelIcon className="w-12 h-12 mb-3 opacity-20" />
                                <p className="font-bold text-sm uppercase tracking-widest">Nenhuma reserva adicionada</p>
                            </div>
                        ) : (
                            hotels.map(hotel => (
                                <div key={hotel.id} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4 group transition-all">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                        <HotelIcon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-black text-slate-800 dark:text-slate-100 text-base sm:text-lg truncate">{hotel.name}</h4>
                                            <button
                                                onClick={() => handleDelete(hotel.id)}
                                                className="p-2 -mt-1 -mr-1 text-slate-300 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {hotel.address && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {hotel.address}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                                            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex flex-col min-w-[80px]">
                                                <span className="text-[8px] font-black text-slate-400 uppercase">In</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatDate(hotel.checkIn)}</span>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex flex-col min-w-[80px]">
                                                <span className="text-[8px] font-black text-slate-400 uppercase">Out</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatDate(hotel.checkOut)}</span>
                                            </div>
                                            <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center justify-center font-black text-[10px] ml-auto whitespace-nowrap">
                                                {calculateNights(hotel.checkIn, hotel.checkOut)} NOITES
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
