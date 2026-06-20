import { Star, MapPin, DollarSign, ChevronRight, TrendingDown, Check } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'

const PackageCard = ({ packageData, rank, onClick }) => {
    const { accommodation, foodPackage, totalCost, score, savings, explanations } = packageData

    const getScoreLabel = (score) => {
        if (score >= 90) return { label: 'Perfect Match', color: 'green' }
        if (score >= 80) return { label: 'Great Match', color: 'blue' }
        if (score >= 70) return { label: 'Good Match', color: 'purple' }
        return { label: 'Fair Match', color: 'gray' }
    }

    const scoreInfo = getScoreLabel(score)

    return (
        <div
            onClick={() => onClick(packageData)}
            className="glass rounded-2xl overflow-hidden cursor-pointer card-hover"
        >
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                <img
                    src={accommodation.image}
                    alt={accommodation.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Rank Badge */}
                {rank <= 3 && (
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">#{rank}</span>
                    </div>
                )}

                {/* Score Badge */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-sm flex items-center space-x-2 ${scoreInfo.color === 'green' ? 'bg-green-600/90' :
                        scoreInfo.color === 'blue' ? 'bg-blue-600/90' :
                            scoreInfo.color === 'purple' ? 'bg-purple-600/90' :
                                'bg-gray-600/90'
                    }`}>
                    <Star className="w-5 h-5 text-white fill-white" />
                    <span className="text-white font-bold">{score}%</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{accommodation.title}</h3>
                    <p className="text-white/90 text-sm">{accommodation.type}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Accommodation Details */}
                <div className="glass rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">🏠 Accommodation</h4>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(accommodation.price)}/mo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{accommodation.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {accommodation.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Food Package */}
                <div className="glass rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">🍽️ Food Package ({foodPackage.restaurants.length} restaurants)</h4>
                        <span className="text-lg font-bold text-gray-900">{formatPrice(foodPackage.estimatedMonthlyCost)}/mo</span>
                    </div>
                    <div className="space-y-2">
                        {foodPackage.restaurants.map((restaurant, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                    <span className="text-gray-700">{restaurant.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-gray-600">{restaurant.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total Cost */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Monthly Cost</p>
                            <p className="text-3xl font-bold gradient-text">{formatPrice(totalCost)}</p>
                        </div>
                        {savings > 0 && (
                            <div className="text-right">
                                <div className="flex items-center space-x-1 text-green-600">
                                    <TrendingDown className="w-5 h-5" />
                                    <span className="font-semibold">Save {formatPrice(savings)}</span>
                                </div>
                                <p className="text-xs text-gray-600">vs. budget</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Why This Package */}
                <div className="glass rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Why This Package?</span>
                    </h5>
                    <ul className="space-y-2">
                        {explanations.slice(0, 3).map((explanation, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5"></div>
                                <span>{explanation}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Button */}
                <button className="btn-primary w-full mt-4 flex items-center justify-center space-x-2">
                    <span>View Full Details</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default PackageCard
