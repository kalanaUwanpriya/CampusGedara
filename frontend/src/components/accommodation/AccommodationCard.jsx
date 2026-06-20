import { MapPin, Star, BedDouble, Bath, Maximize, Heart, Bookmark } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { formatPrice } from '../../utils/helpers'

const AccommodationCard = ({ accommodation, onClick }) => {
    const { userInfo, toggleBookmark } = useContext(AuthContext)
    const {
        _id,
        title,
        type,
        price,
        location,
        image,
        rating,
        reviews,
        amenities,
        bedrooms,
        bathrooms,
        size,
    } = accommodation

    const isBookmarked = userInfo?.accommodationBookmarks?.includes(_id)

    const handleBookmark = (e) => {
        e.stopPropagation()
        toggleBookmark('accommodation', _id)
    }

    return (
        <div
            onClick={() => onClick(accommodation)}
            className="group bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-slate-800 relative"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-dark-bg">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-sm">
                    <span className="text-xs font-black text-gray-900 dark:text-dark-text-main uppercase tracking-widest">{type}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-indigo-600 dark:bg-dark-accent text-white px-5 py-2.5 rounded-2xl shadow-xl shadow-indigo-600/20 dark:shadow-none">
                    <span className="text-xl font-black">{formatPrice(price)}</span>
                    <span className="text-xs opacity-80 font-bold ml-1">/mo</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main leading-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-dark-accent transition-colors">
                        {title}
                    </h3>
                    <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        accommodation.status === 'Booked' 
                        ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30' 
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${accommodation.status === 'Booked' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                        {accommodation.status === 'Booked' ? 'Full' : 'Ready'}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 dark:text-dark-text-muted mb-6">
                    <MapPin className="w-4 h-4 text-indigo-500 dark:text-dark-accent" />
                    <span className="text-sm font-bold">{location}</span>
                </div>

                {/* Property Details */}
                <div className="flex items-center justify-between mb-6 py-4 border-t border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-dark-accent/10 flex items-center justify-center">
                            <BedDouble className="w-4 h-4 text-indigo-600 dark:text-dark-accent" />
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-dark-text-main">{bedrooms} <span className="text-[10px] text-slate-400 font-bold">Bed</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center">
                            <Bath className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-dark-text-main">{bathrooms} <span className="text-[10px] text-slate-400 font-bold">Bath</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center">
                            <Maximize className="w-4 h-4 text-rose-600" />
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-dark-text-main">{size}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {(Array.isArray(amenities)
                            ? amenities
                            : typeof amenities === 'string' && amenities
                                ? amenities.split(',').map(a => a.trim())
                                : []
                        ).slice(0, 2).map((amenity, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-dark-text-muted text-[10px] font-black uppercase tracking-tighter rounded-lg border border-slate-100 dark:border-slate-800"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={handleBookmark}
                        className={`p-3 rounded-2xl transition-all duration-300 ${
                            isBookmarked 
                            ? 'bg-indigo-600 dark:bg-dark-accent text-white shadow-lg shadow-indigo-600/20 dark:shadow-none' 
                            : 'bg-slate-50 dark:bg-dark-bg text-slate-400 dark:text-dark-text-muted hover:text-indigo-600 dark:hover:text-dark-accent border border-slate-100 dark:border-slate-800'
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-white' : ''}`} />
                    </button>
                </div>


            </div>
        </div>
    )
}

export default AccommodationCard
