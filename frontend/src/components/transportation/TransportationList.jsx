import { useState, useEffect } from 'react'
import axios from 'axios'
import RouteSearch from './RouteSearch'
import RouteCard from './RouteCard'
import ScheduleView from './ScheduleView'
import { Bus } from 'lucide-react'

const TransportationList = () => {
    const [transportRoutes, setTransportRoutes] = useState([])
    const [filteredRoutes, setFilteredRoutes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const { data } = await axios.get('/api/transportation');
                const list = Array.isArray(data) ? data : [];
                setTransportRoutes(list);
                setFilteredRoutes(list);
            } catch (error) {
                console.error("Error fetching transportation routes:", error);
                setTransportRoutes([]);
                setFilteredRoutes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = transportRoutes.filter((route) =>
            route.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.endLocation.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredRoutes(filtered)
    }

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column - Search & Map */}
                <div className="space-y-6">
                    <RouteSearch onSearch={handleSearch} />
                </div>

                {/* Middle column - Routes List */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main">
                                Available Routes
                            </h3>
                            <div className="px-4 py-1.5 bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-full shadow-sm text-sm font-bold text-slate-500 dark:text-dark-text-muted flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span className="text-indigo-600 dark:text-dark-accent">{filteredRoutes.length}</span> routes active
                            </div>
                        </div>

                        {filteredRoutes.length === 0 ? (
                            <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Bus className="w-8 h-8 text-indigo-400" />
                                </div>
                                <p className="text-xl font-black text-gray-900 dark:text-dark-text-main">
                                    {transportRoutes.length === 0 ? 'No transport routes available yet.' : 'No routes found matching your search.'}
                                </p>
                                <p className="text-gray-500 dark:text-dark-text-muted mt-2">
                                    {transportRoutes.length === 0 ? 'The admin will add campus routes soon.' : 'Try a different search term or zone.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredRoutes.map((route) => (
                                    <RouteCard
                                        key={route._id || route.id}
                                        route={route}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TransportationList
