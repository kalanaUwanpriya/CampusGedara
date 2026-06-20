import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-500">
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-dark-text-muted' : 'text-slate-400'}`}>
                {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-all duration-500 p-1 flex items-center ${
                    theme === 'dark' ? 'bg-dark-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-slate-200 shadow-inner'
                }`}
            >
                <div
                    className={`absolute w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-500 transform ${
                        theme === 'dark' ? 'translate-x-7 bg-white rotate-0' : 'translate-x-0 bg-white rotate-[360deg] shadow-md'
                    }`}
                >
                    {theme === 'dark' ? (
                        <Moon className="w-3 h-3 text-dark-accent" />
                    ) : (
                        <Sun className="w-3 h-3 text-amber-500" />
                    )}
                </div>
            </button>
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-dark-text-main' : 'text-slate-600'}`}>
                {theme === 'dark' ? 'OFF' : 'ON'}
            </span>
        </div>
    );
};

export default ThemeToggle;
