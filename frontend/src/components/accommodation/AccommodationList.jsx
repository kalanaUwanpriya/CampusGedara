import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Building2, Star } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import AccommodationSearch from './AccommodationSearch'
import AccommodationCard from './AccommodationCard'
import AccommodationModal from './AccommodationModal'

const AccommodationList = () => {
    const { userInfo } = useContext(AuthContext)
    const [accommodations, setAccommodations] = useState([])
    const [filteredAccommodations, setFilteredAccommodations] = useState([])
    const [selectedAccommodation, setSelectedAccommodation] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({ type: 'all', priceRange: 'all', bedrooms: 'all' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const { data } = await axios.get('/api/accommodations')
                const list = Array.isArray(data) ? data : []
                setAccommodations(list)
                setFilteredAccommodations(list)
            } catch (err) {
                console.error('Error fetching accommodations:', err)
                setError('Failed to load accommodations. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        fetchAccommodations()
    }, [])

    useEffect(() => {
        let result = accommodations;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(acc => 
                (acc.buildingName && acc.buildingName.toLowerCase().includes(lower)) ||
                (acc.type && acc.type.toLowerCase().includes(lower)) ||
                (acc.location && acc.location.toLowerCase().includes(lower))
            );
        }

        if (filters.type !== 'all') {
            result = result.filter(acc => acc.type === filters.type);
        }

        if (filters.priceRange !== 'all') {
            result = result.filter(acc => {
                const price = Number(acc.price);
                if (filters.priceRange === 'budget') return price < 30000;
                if (filters.priceRange === 'moderate') return price >= 30000 && price <= 75000;
                if (filters.priceRange === 'premium') return price > 75000;
                return true;
            });
        }

        if (filters.bedrooms !== 'all') {
            const bedroomCount = parseInt(filters.bedrooms, 10);
            result = result.filter(acc => {
                if (isNaN(acc.bedrooms)) return true;
                if (bedroomCount === 3) return Number(acc.bedrooms) >= 3;
                return Number(acc.bedrooms) === bedroomCount;
            });
        }

        setFilteredAccommodations(result);
    }, [accommodations, searchTerm, filters]);

    const bookmarkedAccommodations = filteredAccommodations.filter(acc => 
        userInfo?.accommodationBookmarks?.includes(acc._id)
    )
    const otherAccommodations = filteredAccommodations.filter(acc => 
        !userInfo?.accommodationBookmarks?.includes(acc._id)
    )

    if (loading) return <div className="text-center py-20 text-indigo-600 dark:text-dark-accent font-bold"><p className="animate-pulse">Loading properties...</p></div>
    if (error) return <div className="text-center py-20 text-red-500 dark:text-rose-400 font-bold">{error}</div>

    return (
        <div className="space-y-6">
            <AccommodationSearch
                onSearch={setSearchTerm}
                onFilterChange={setFilters}
            />

            {filteredAccommodations.length === 0 ? (
                <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-dark-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-dark-text-main">
                        {accommodations.length === 0 ? 'No accommodations available yet.' : 'No accommodations found matching your criteria.'}
                    </p>
                    <p className="text-gray-500 dark:text-dark-text-muted mt-2">
                        {accommodations.length === 0 ? 'The admin will add available properties soon.' : 'Try adjusting your filters or search terms.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Saved Properties Section */}
                    {bookmarkedAccommodations.length > 0 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main mb-6 flex items-center gap-3">
                                <span className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-sm">
                                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                </span>
                                Saved Properties
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarkedAccommodations.map((acc) => (
                                    <AccommodationCard
                                        key={`saved-${acc._id}`}
                                        accommodation={{
                                            ...acc,
                                            title: acc.buildingName,
                                            location: acc.distance ? `${acc.distance} miles from campus` : 'On Campus',
                                            image: (acc.images && acc.images.length > 0) ? acc.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=100',
                                            status: acc.status || 'Available',
                                            amenities: typeof acc.amenities === 'string' ? acc.amenities.split(',').map(a => a.trim()).filter(Boolean) : (acc.amenities || []),
                                            rating: acc.rating || 0,
                                            reviews: acc.reviews || 0,
                                            size: acc.size ? `${acc.size} sq ft` : '—',
                                        }}
                                        onClick={setSelectedAccommodation}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Items Section */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main flex items-center gap-3">
                                <span className="p-3 bg-indigo-50 dark:bg-dark-accent/10 rounded-2xl shadow-sm">
                                    <Building2 className="w-6 h-6 text-indigo-600 dark:text-dark-accent" />
                                </span>
                                {bookmarkedAccommodations.length > 0 ? 'All Accommodations' : 'Explore Accommodations'}
                            </h2>
                            <p className="text-slate-400 dark:text-dark-text-muted bg-white dark:bg-dark-card px-5 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-sm font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-indigo-600 dark:text-dark-accent">{otherAccommodations.length}</span> properties found
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherAccommodations.map((acc) => (
                                <AccommodationCard
                                    key={acc._id}
                                    accommodation={{
                                        ...acc,
                                        title: acc.buildingName,
                                        location: acc.distance ? `${acc.distance} miles from campus` : 'On Campus',
                                        image: (acc.images && acc.images.length > 0) ? acc.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
                                        status: acc.status || 'Available',
                                        amenities: typeof acc.amenities === 'string' ? acc.amenities.split(',').map(a => a.trim()).filter(Boolean) : (acc.amenities || []),
                                        rating: acc.rating || 0,
                                        reviews: acc.reviews || 0,
                                        size: acc.size ? `${acc.size} sq ft` : '—',
                                    }}
                                    onClick={setSelectedAccommodation}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <AccommodationModal
                accommodation={selectedAccommodation}
                isOpen={!!selectedAccommodation}
                onClose={() => setSelectedAccommodation(null)}
            />
        </div>
    )
}

export default AccommodationList
