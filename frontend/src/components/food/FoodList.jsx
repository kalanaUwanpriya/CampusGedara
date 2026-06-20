import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Star, UtensilsCrossed } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import FoodSearch from './FoodSearch'
import RestaurantCard from './RestaurantCard'
import MenuModal from './MenuModal'

const FoodList = () => {
    const { userInfo } = useContext(AuthContext)
    const [restaurants, setRestaurants] = useState([])
    const [filteredRestaurants, setFilteredRestaurants] = useState([])
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({ cuisine: 'all', dietary: 'all', dining: 'all', location: 'all', price: 'all' })

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axios.get('/api/food-services');
                // Map the backend structure to fit the UI gracefully
                const mappedData = data.map(r => ({
                    id: r._id,
                    name: r.restaurantName,
                    type: r.locationType, // On Campus / Outside
                    description: r.description,
                    cuisine: r.diningOptions.join(', ') || 'Various',
                    dietary: r.availableMeals || [],
                    diningOptions: r.diningOptions || [],
                    operatingHours: r.operatingHours || 'Open',
                    rating: r.rating > 0 ? r.rating.toFixed(1) : 'New',
                    reviews: r.numReviews || 0,
                    distance: r.location,
                    image: r.images?.[0] || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
                    images: r.images || [],
                    phone: r.phone || '',
                    email: r.email || '',
                    menuItems: r.menuItems || [],
                    rawReviews: r.reviews || []
                }));
                setRestaurants(mappedData);
                setFilteredRestaurants(mappedData);
            } catch (error) {
                console.error('Failed to fetch food services:', error);
                setRestaurants([]);
                setFilteredRestaurants([]);
            }
        };
        fetchRestaurants();
    }, []);

    useEffect(() => {
        let result = restaurants;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(restaurant => 
                (restaurant.name && restaurant.name.toLowerCase().includes(lower)) ||
                (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(lower)) ||
                (restaurant.type && restaurant.type.toLowerCase().includes(lower))
            );
        }

        if (filters.cuisine && filters.cuisine !== 'all') {
            result = result.filter(restaurant => restaurant.cuisine === filters.cuisine);
        }

        if (filters.dietary && filters.dietary !== 'all') {
            result = result.filter(restaurant => 
                restaurant.dietary && restaurant.dietary.includes(filters.dietary)
            );
        }

        if (filters.dining && filters.dining !== 'all') {
            result = result.filter(restaurant => 
                restaurant.diningOptions && restaurant.diningOptions.includes(filters.dining)
            );
        }

        if (filters.location && filters.location !== 'all') {
            result = result.filter(restaurant => restaurant.type === filters.location);
        }

        if (filters.price && filters.price !== 'all') {
            result = result.filter(restaurant => restaurant.price === filters.price);
        }

        setFilteredRestaurants(result);
    }, [restaurants, searchTerm, filters]);

    const bookmarkedRestaurants = filteredRestaurants.filter(r => 
        userInfo?.foodBookmarks?.includes(r.id)
    )
    const otherRestaurants = filteredRestaurants.filter(r => 
        !userInfo?.foodBookmarks?.includes(r.id)
    )

    return (
        <div className="space-y-6">
            <FoodSearch
                onSearch={setSearchTerm}
                onFilterChange={setFilters}
            />

            {filteredRestaurants.length === 0 ? (
                <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UtensilsCrossed className="w-8 h-8 text-rose-400" />
                    </div>
                    <p className="text-xl font-black text-gray-900 dark:text-dark-text-main">
                        {restaurants.length === 0 ? 'No dining venues available yet.' : 'No restaurants found matching your criteria.'}
                    </p>
                    <p className="text-gray-500 dark:text-dark-text-muted mt-2">
                        {restaurants.length === 0 ? 'The admin will add food services soon.' : 'Try adjusting your filters or search terms.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Bookmarked Section */}
                    {bookmarkedRestaurants.length > 0 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main mb-6 flex items-center gap-3">
                                <span className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-sm">
                                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                </span>
                                Your Favorite Places
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bookmarkedRestaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={`bookmarked-${restaurant.id}`}
                                        restaurant={restaurant}
                                        onClick={setSelectedRestaurant}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Items Section */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main flex items-center gap-3">
                                <span className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl shadow-sm">
                                    <UtensilsCrossed className="w-6 h-6 text-rose-500" />
                                </span>
                                {bookmarkedRestaurants.length > 0 ? 'All Restaurants' : 'Explore Restaurants'}
                            </h2>
                            <p className="text-slate-400 dark:text-dark-text-muted bg-white dark:bg-dark-card px-5 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-sm font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-rose-600 dark:text-rose-400 font-bold">{otherRestaurants.length}</span> venues found
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherRestaurants.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    onClick={setSelectedRestaurant}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <MenuModal
                restaurant={selectedRestaurant}
                isOpen={!!selectedRestaurant}
                onClose={() => setSelectedRestaurant(null)}
            />
        </div>
    )
}

export default FoodList
