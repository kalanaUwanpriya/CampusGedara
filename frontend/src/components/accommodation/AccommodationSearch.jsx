import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

const AccommodationSearch = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        type: 'all',
        priceRange: 'all',
        bedrooms: 'all',
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
            {/* Search Bar */}
            <div className="glass rounded-xl p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                            type="text"
                            placeholder="Search by location, type, or amenities..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="input-field !pl-12"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn-outline flex items-center justify-center space-x-2 md:w-auto"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 animate-slide-down">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="input-field"
                            >
                                <option value="all">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Dorm">Dorm</option>
                                <option value="Shared">Shared</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range
                            </label>
                            <select
                                value={filters.priceRange}
                                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                className="input-field"
                            >
                                <option value="all">All Prices</option>
                                <option value="budget">Under Rs. 30,000</option>
                                <option value="moderate">Rs. 30,000 - Rs. 75,000</option>
                                <option value="premium">Rs. 75,000+</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bedrooms
                            </label>
                            <select
                                value={filters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                className="input-field"
                            >
                                <option value="all">Any</option>
                                <option value="1">1 Bedroom</option>
                                <option value="2">2 Bedrooms</option>
                                <option value="3">3+ Bedrooms</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccommodationSearch
