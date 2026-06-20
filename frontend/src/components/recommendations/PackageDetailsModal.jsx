import { X, Star, MapPin, DollarSign, TrendingDown, Utensils, Home, Check, PieChart } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import { calculateCostBreakdown, calculateProjections, suggestOptimizations } from '../../utils/budgetOptimizer'

const PackageDetailsModal = ({ packageData, isOpen, onClose, preferences }) => {
    if (!isOpen || !packageData) return null

    const { accommodation, foodPackage, totalCost, score, savings, explanations, scoreBreakdown } = packageData
    const breakdown = calculateCostBreakdown(packageData)
    const projections = calculateProjections(totalCost)
    const optimizations = suggestOptimizations(packageData, preferences)

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative glass rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-8 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Star className="w-8 h-8 text-white fill-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">Package Details</h2>
                                    <p className="text-white/90">{score}% Match Score</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white/90 text-sm">Total Monthly Cost</p>
                                <p className="text-4xl font-bold">{formatPrice(totalCost)}</p>
                            </div>
                        </div>

                        {savings > 0 && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
                                <TrendingDown className="w-6 h-6" />
                                <div>
                                    <p className="font-semibold">You Save {formatPrice(savings)} per month!</p>
                                    <p className="text-sm text-white/80">That's {formatPrice(savings * 9)} per academic year</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Match Explanation */}
                        <div className="glass rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Check className="w-6 h-6 text-green-600" />
                                <span>Why We Recommend This Package</span>
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {explanations.map((explanation, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                                        <p className="text-gray-700">{explanation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="glass rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Star className="w-6 h-6 text-yellow-600" />
                                <span>Match Score Breakdown</span>
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(scoreBreakdown.breakdown).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-semibold text-gray-900">{Math.round(value)}/100</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Accommodation Details */}
                        <div className="glass rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Home className="w-6 h-6 text-primary-600" />
                                <span>Accommodation Details</span>
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <img
                                        src={accommodation.image}
                                        alt={accommodation.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{accommodation.title}</h4>
                                    <p className="text-gray-600 mb-2">{accommodation.type}</p>
                                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{accommodation.location}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatPrice(accommodation.price)}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Amenities</p>
                                        <div className="flex flex-wrap gap-2">
                                            {accommodation.amenities.map((amenity, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Features</p>
                                        <p className="text-sm text-gray-600">{accommodation.bedrooms} Bedroom • {accommodation.bathrooms} Bathroom</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Food Package Details */}
                        <div className="glass rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Utensils className="w-6 h-6 text-green-600" />
                                <span>Food Package - {foodPackage.restaurants.length} Restaurants</span>
                            </h3>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Estimated Monthly Food Cost</p>
                                <p className="text-2xl font-bold text-gray-900">{formatPrice(foodPackage.estimatedMonthlyCost)}</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {foodPackage.restaurants.map((restaurant, idx) => (
                                    <div key={idx} className="bg-white/50 rounded-lg p-4">
                                        <img
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                        />
                                        <h4 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-semibold">{restaurant.rating}</span>
                                            </div>
                                            <span className="text-sm text-gray-600">{restaurant.price}</span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {restaurant.dietary.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Budget Breakdown */}
                        <div className="glass rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <PieChart className="w-6 h-6 text-purple-600" />
                                <span>Budget Breakdown</span>
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Home className="w-5 h-5 text-blue-600" />
                                                <span className="font-medium text-gray-900">Accommodation</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatPrice(breakdown.accommodation.amount)}</p>
                                                <p className="text-sm text-gray-600">{breakdown.accommodation.percentage}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Utensils className="w-5 h-5 text-green-600" />
                                                <span className="font-medium text-gray-900">Food</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatPrice(breakdown.food.amount)}</p>
                                                <p className="text-sm text-gray-600">{breakdown.food.percentage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Cost Projections</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Per Semester (4 months)</span>
                                            <span className="font-semibold text-gray-900">{formatPrice(projections.semester)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Academic Year (9 months)</span>
                                            <span className="font-semibold text-gray-900">{formatPrice(projections.yearly)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t">
                                            <span className="text-gray-600">Full Year (12 months)</span>
                                            <span className="font-bold text-gray-900">{formatPrice(projections.fullYear)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Optimizations */}
                        {optimizations.length > 0 && (
                            <div className="glass rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                    <span>Budget Insights</span>
                                </h3>
                                {optimizations.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg mb-3 ${opt.type === 'optimal' ? 'bg-green-50' :
                                                opt.type === 'reduce' ? 'bg-orange-50' :
                                                    'bg-blue-50'
                                            }`}
                                    >
                                        <p className="font-semibold text-gray-900 mb-2">{opt.message}</p>
                                        {opt.options.length > 0 && (
                                            <ul className="space-y-1">
                                                {opt.options.map((option, i) => (
                                                    <li key={i} className="text-sm text-gray-700 flex items-start space-x-2">
                                                        <span className="text-gray-400">•</span>
                                                        <span>{option}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                                <Check className="w-5 h-5" />
                                <span>Select This Package</span>
                            </button>
                            <button className="btn-secondary flex-1">
                                Customize Package
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PackageDetailsModal
