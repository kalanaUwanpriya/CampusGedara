import { MapPin, Navigation } from 'lucide-react'

const CampusMap = () => {
    return (
        <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors duration-500">
            <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main mb-6">Campus Transportation Map</h3>

            {/* Simplified map representation */}
            <div className="relative bg-slate-50 dark:bg-dark-bg rounded-[2rem] p-8 h-96 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                {/* Decorative map elements */}
                <div className="absolute inset-0 opacity-20 dark:opacity-40">
                    <svg className="w-full h-full" viewBox="0 0 400 400">
                        <path d="M 50 50 L 350 50 L 350 350 L 50 350 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-700" />
                        <path d="M 100 200 L 300 200" stroke="currentColor" strokeWidth="3" className="text-indigo-400 dark:text-indigo-900" />
                        <path d="M 200 100 L 200 300" stroke="currentColor" strokeWidth="3" className="text-purple-400 dark:text-purple-900" />
                    </svg>
                </div>

                {/* Map markers */}
                <div className="relative h-full flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-8 w-full max-w-md">
                        {[
                            'Main Gate',
                            'Library',
                            'Student Center',
                            'Sports Complex',
                            'Residence Halls',
                            'Science Building',
                        ].map((location, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                    <MapPin className="w-7 h-7 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 dark:text-dark-text-muted text-center uppercase tracking-widest leading-tight">
                                    {location}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
                        <span className="text-[10px] font-black text-slate-600 dark:text-dark-text-muted uppercase tracking-widest">Bus Stop</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-1 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50"></div>
                        <span className="text-[10px] font-black text-slate-600 dark:text-dark-text-muted uppercase tracking-widest">Route Blue</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-1 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></div>
                        <span className="text-[10px] font-black text-slate-600 dark:text-dark-text-muted uppercase tracking-widest">Route Purple</span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-6 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-black/20 flex items-center justify-center gap-3">
                <Navigation className="w-5 h-5 fill-white" />
                <span>Open Navigation System</span>
            </button>
        </div>
    );
};

export default CampusMap
