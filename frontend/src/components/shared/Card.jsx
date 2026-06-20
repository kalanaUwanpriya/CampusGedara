import React from 'react';
import * as Icons from 'lucide-react';

const COLOR_MAPS = {
    indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', shadow: 'shadow-indigo-200', text: 'text-indigo-600', border: 'border-indigo-100', light: 'bg-indigo-50' },
    pink: { bg: 'bg-pink-600', hover: 'hover:bg-pink-700', shadow: 'shadow-pink-200', text: 'text-pink-600', border: 'border-pink-100', light: 'bg-pink-50' },
    orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', shadow: 'shadow-orange-200', text: 'text-orange-600', border: 'border-orange-100', light: 'bg-orange-50' },
    emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', shadow: 'shadow-emerald-200', text: 'text-emerald-600', border: 'border-emerald-100', light: 'bg-emerald-50' },
};

const Card = ({ item, color = 'indigo', hideButton = false }) => {
    const theme = COLOR_MAPS[color] || COLOR_MAPS.indigo;
    const Icon = Icons[item.icon] || Icons.Activity;

    return (
        <div className="group bg-white dark:bg-dark-card rounded-2xl p-0 shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-dark-accent/50 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
            {/* Image Section */}
            {item.image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Icon Badge Overlay */}
                    <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm shadow-lg flex items-center justify-center ${theme.text} dark:text-dark-accent border border-white/50 dark:border-slate-700 z-20`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="p-6 relative flex-1 flex flex-col">
                {!item.image && (
                    <div className={`w-12 h-12 rounded-xl ${theme.light} dark:bg-dark-accent/10 ${theme.text} dark:text-dark-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border ${theme.border} dark:border-dark-accent/20 group-hover:bg-indigo-500 dark:group-hover:bg-dark-accent group-hover:text-white dark:group-hover:text-white group-hover:border-transparent`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main mb-3 group-hover:text-indigo-600 dark:group-hover:text-dark-accent transition-colors">
                    {item.name}
                </h3>
                <p className="text-gray-600 dark:text-dark-text-muted leading-relaxed text-sm flex-1">
                    {item.description}
                </p>

                {/* Action Button */}
                {!hideButton && (
                    <div className="mt-6 flex items-center justify-between gap-4">
                        <button
                            onClick={(e) => {
                                // Pass a special flag to signify the action button was clicked directly
                                if (typeof item.pastEvents !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('cardAction', { detail: { name: item.name, action: 'apply' } }));
                                } else {
                                    window.dispatchEvent(new CustomEvent('cardAction', { detail: { name: item.name, action: 'register' } }));
                                }
                                // We don't stopPropagation so the parent card's onClick (which opens the modal) still fires.
                            }}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md group-hover:shadow-lg ${theme.bg} dark:bg-dark-accent text-white ${theme.hover} hover:-translate-y-0.5`}
                        >
                            {item.pastEvents ? "Apply Now" : "Register"}
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-bg flex items-center justify-center text-gray-400 dark:text-dark-text-muted group-hover:text-indigo-500 dark:group-hover:text-dark-accent group-hover:bg-indigo-50 dark:group-hover:bg-dark-accent/10 transition-colors">
                            <Icons.ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                )}
                {hideButton && (
                    <div className="mt-6 flex items-center justify-end">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-bg flex items-center justify-center text-gray-400 dark:text-dark-text-muted group-hover:text-indigo-500 dark:group-hover:text-dark-accent group-hover:bg-indigo-50 dark:group-hover:bg-dark-accent/10 transition-colors">
                            <Icons.ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                )}
            </div>

            {/* Hover Highlight Overlay */}
            <div className={`absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 dark:group-hover:border-dark-accent/20 rounded-2xl pointer-events-none transition-colors duration-300`} />
        </div>
    );
};

export default Card;
