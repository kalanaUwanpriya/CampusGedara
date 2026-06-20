import { useState } from 'react'
import { Search, MapPin, Calendar } from 'lucide-react'

const RouteSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        onSearch(e.target.value)
    }

    return (
        <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors duration-500">
            <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main mb-6">Find Your Route</h3>

            <div className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent z-10 transition-colors" />
                    <input
                        type="text"
                        placeholder="Route name or number..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none font-bold text-slate-900 dark:text-dark-text-main transition-all placeholder:text-slate-400 dark:placeholder:text-dark-text-muted/50"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent z-10 transition-colors" />
                        <input
                            type="text"
                            placeholder="Starting Location"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none font-bold text-slate-900 dark:text-dark-text-main transition-all placeholder:text-slate-400 dark:placeholder:text-dark-text-muted/50"
                        />
                    </div>
                    <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-dark-text-muted group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 z-10 transition-colors" />
                        <input
                            type="text"
                            placeholder="Destination"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none font-bold text-slate-900 dark:text-dark-text-main transition-all placeholder:text-slate-400 dark:placeholder:text-dark-text-muted/50"
                        />
                    </div>
                </div>

                <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent z-10 transition-colors" />
                    <input
                        type="datetime-local"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none font-bold text-slate-900 dark:text-dark-text-main transition-all"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                    />
                </div>

                <button className="w-full py-4 bg-indigo-600 dark:bg-dark-accent hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 dark:shadow-none mt-2">
                    Search Routes
                </button>
            </div>
        </div>
    );
};

export default RouteSearch
