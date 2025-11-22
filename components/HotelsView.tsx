
import React, { useState, FormEvent } from 'react';
import { HotelReservation } from '../types';
import { HotelIcon, TrashIcon } from './icons';

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

const calculateNights = (start: string, end: string): number => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const HotelsView: React.FC = () => {
    const [hotels, setHotels] = useLocalStorage<HotelReservation[]>('japanTripHotels', []);
    const [formData, setFormData] = useState({
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

        setHotels((prev) => [...prev, newHotel].sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()));
        setFormData({ name: '', address: '', checkIn: '', checkOut: '' });
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja remover este hotel?')) {
            setHotels((prev) => prev.filter(h => h.id !== id));
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Hospedagens</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Organize suas reservas de hotel, datas de check-in e endereços.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60 sticky top-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Adicionar Hotel</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Hotel</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                        placeholder="Ex: Hotel Gracery Shinjuku"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Endereço</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                        placeholder="Endereço completo"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Check-in</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.checkIn}
                                            onChange={e => setFormData({...formData, checkIn: e.target.value})}
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Check-out</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.checkOut}
                                            onChange={e => setFormData({...formData, checkOut: e.target.value})}
                                            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    Adicionar Reserva
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-4">
                        {hotels.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                                <HotelIcon className="w-12 h-12 mb-2 opacity-50" />
                                <p>Nenhum hotel adicionado ainda.</p>
                            </div>
                        ) : (
                            hotels.map(hotel => (
                                <div key={hotel.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between gap-4 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <HotelIcon className="w-5 h-5 text-indigo-500" />
                                            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{hotel.name}</h4>
                                        </div>
                                        {hotel.address && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 pl-7">{hotel.address}</p>
                                        )}
                                        <div className="flex flex-wrap gap-3 pl-7">
                                            <div className="bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-md text-sm border border-slate-200 dark:border-slate-700">
                                                <span className="text-xs uppercase text-slate-400 font-bold block">Check-in</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(hotel.checkIn)}</span>
                                            </div>
                                            <div className="bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-md text-sm border border-slate-200 dark:border-slate-700">
                                                <span className="text-xs uppercase text-slate-400 font-bold block">Check-out</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(hotel.checkOut)}</span>
                                            </div>
                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-md text-sm border border-indigo-100 dark:border-indigo-800/30 flex flex-col justify-center">
                                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                                    {calculateNights(hotel.checkIn, hotel.checkOut)} noites
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-end">
                                        <button
                                            onClick={() => handleDelete(hotel.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            title="Remover reserva"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
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
