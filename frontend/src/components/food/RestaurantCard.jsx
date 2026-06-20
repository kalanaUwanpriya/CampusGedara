import { MapPin, Star, Clock } from 'lucide-react'

const RestaurantCard = ({ restaurant, onClick }) => {
    const { name, type, rating, distance, image, operatingHours, dietary } = restaurant

    return (
        <div
            onClick={() => onClick(restaurant)}
            className="group bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-slate-800 relative"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-dark-bg">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-900 dark:text-dark-text-main leading-tight mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-dark-text-muted flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {type}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-xl border border-amber-100 dark:border-amber-900/20 shadow-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-gray-900 dark:text-dark-text-main">{rating}</span>
                    </div>
                </div>

                <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-dark-text-muted font-bold">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-rose-500" />
                        </div>
                        <span className="text-sm">{distance}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-dark-text-muted font-bold">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-sm">{operatingHours}</span>
                    </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-2">
                    {dietary.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tighter rounded-lg border border-emerald-100 dark:border-emerald-900/20"
                        >
                            {tag}
                        </span>
                    ))}
                    {dietary.length > 3 && (
                        <span className="px-3 py-1.5 bg-slate-50 dark:bg-dark-bg text-slate-500 dark:text-dark-text-muted text-[10px] font-black uppercase tracking-tighter rounded-lg border border-slate-100 dark:border-slate-800">
                            +{dietary.length - 3} more
                        </span>
                    )}
                </div>


            </div>
        </div>
    )
}

export default RestaurantCard
