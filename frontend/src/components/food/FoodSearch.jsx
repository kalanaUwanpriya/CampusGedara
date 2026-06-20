import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

const FoodSearch = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        cuisine: 'all',
        dietary: 'all',
        price: 'all',
    })

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        onSearch(e.target.value)
    }

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-colors duration-500">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-dark-text-muted group-focus-within:text-rose-500 dark:group-focus-within:text-rose-400 z-10 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search restaurants, cuisine, or dishes..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 outline-none font-bold text-slate-900 dark:text-dark-text-main transition-all placeholder:text-slate-400 dark:placeholder:text-dark-text-muted/50"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black transition-all duration-300 border ${
                            showFilters 
                            ? 'bg-rose-600 dark:bg-rose-600 text-white border-rose-600 shadow-xl shadow-rose-600/20' 
                            : 'bg-white dark:bg-dark-bg text-slate-700 dark:text-dark-text-main border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/40'
                        }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span>Filter Options</span>
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted mb-3 ml-1">
                                Available Meals
                            </label>
                            <select
                                value={filters.dietary}
                                onChange={(e) => handleFilterChange('dietary', e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 outline-none font-bold text-slate-900 dark:text-dark-text-main appearance-none cursor-pointer"
                            >
                                <option value="all">Any Meal</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted mb-3 ml-1">
                                Dining Service
                            </label>
                            <select
                                value={filters.dining || 'all'}
                                onChange={(e) => handleFilterChange('dining', e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 outline-none font-bold text-slate-900 dark:text-dark-text-main appearance-none cursor-pointer"
                            >
                                <option value="all">Any Service</option>
                                <option value="Dine-in">Dine-in</option>
                                <option value="Takeaway">Takeaway</option>
                                <option value="Hostel Delivery">Hostel Delivery</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted mb-3 ml-1">
                                Location Zone
                            </label>
                            <select
                                value={filters.location || 'all'}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 outline-none font-bold text-slate-900 dark:text-dark-text-main appearance-none cursor-pointer"
                            >
                                <option value="all">All Locations</option>
                                <option value="On Campus">Inside Campus</option>
                                <option value="Outside campus">Outside Campus</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodSearch
