import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check, DollarSign, UtensilsCrossed, Home, MapPin, Sliders } from 'lucide-react'

const PreferenceWizard = ({ onComplete, onClose }) => {
    const [step, setStep] = useState(1)
    const [preferences, setPreferences] = useState({
        budget: {
            monthly: 1200,
            flexibility: 'flexible',
            priorities: 'balanced'
        },
        dietary: {
            restrictions: [],
            allergies: '',
            cuisinePreferences: [],
            mealFrequency: 'weekdays'
        },
        lifestyle: {
            cookingFrequency: 'sometimes',
            socialPreference: 'moderate',
            studyEnvironment: 'both',
            commuteTolerance: '15min'
        },
        proximity: {
            campusDistance: '<1mi',
            foodDistance: 'walking',
            transportAccess: true
        }
    })

    const totalSteps = 4

    const updatePreference = (category, key, value) => {
        setPreferences(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
    }

    const toggleArrayItem = (category, key, value) => {
        setPreferences(prev => {
            const currentArray = prev[category][key]
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value]

            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [key]: newArray
                }
            }
        })
    }

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            onComplete(preferences)
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in bg-black/50 backdrop-blur-sm">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass rounded-2xl max-w-3xl w-full animate-scale-in">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold gradient-text mb-2">
                            Find Your Perfect Package
                        </h2>
                        <p className="text-gray-600">
                            Answer a few questions to get personalized recommendations
                        </p>

                        {/* Progress bar */}
                        <div className="mt-4 flex items-center space-x-2">
                            {[...Array(totalSteps)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${index < step ? 'bg-gradient-to-r from-primary-600 to-secondary-600' : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Step {step} of {totalSteps}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[400px]">
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Budget & Priorities</h3>
                                        <p className="text-gray-600">Set your monthly budget and spending preferences</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Budget: ${preferences.budget.monthly}
                                    </label>
                                    <input
                                        type="range"
                                        min="500"
                                        max="3000"
                                        step="50"
                                        value={preferences.budget.monthly}
                                        onChange={(e) => updatePreference('budget', 'monthly', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>$500</span>
                                        <span>$3000</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Budget Flexibility
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['strict', 'flexible', 'very-flexible'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => updatePreference('budget', 'flexibility', option)}
                                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${preferences.budget.flexibility === option
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className="font-semibold capitalize">{option.replace('-', ' ')}</p>
                                                <p className="text-xs mt-1 text-gray-600">
                                                    {option === 'strict' ? 'Stay within budget' :
                                                        option === 'flexible' ? 'Some wiggle room' :
                                                            'Open to options'}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Spending Priority
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'accommodation', label: 'Better Housing', icon: Home },
                                            { value: 'food', label: 'Better Food', icon: UtensilsCrossed },
                                            { value: 'balanced', label: 'Balanced', icon: Sliders }
                                        ].map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                onClick={() => updatePreference('budget', 'priorities', value)}
                                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${preferences.budget.priorities === value
                                                        ? 'border-primary-600 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <Icon className={`w-6 h-6 mx-auto mb-2 ${preferences.budget.priorities === value ? 'text-primary-600' : 'text-gray-400'
                                                    }`} />
                                                <p className="font-semibold text-sm">{label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                                        <UtensilsCrossed className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Dietary Preferences</h3>
                                        <p className="text-gray-600">Help us match you with suitable dining options</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Dietary Restrictions (Select all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free'].map((restriction) => (
                                            <button
                                                key={restriction}
                                                onClick={() => toggleArrayItem('dietary', 'restrictions', restriction)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${preferences.dietary.restrictions.includes(restriction)
                                                        ? 'border-green-600 bg-green-50 text-green-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {restriction}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Cuisine Preferences (Optional)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['American', 'Indian', 'Italian', 'Chinese', 'Mexican', 'Japanese', 'Thai', 'Mediterranean'].map((cuisine) => (
                                            <button
                                                key={cuisine}
                                                onClick={() => toggleArrayItem('dietary', 'cuisinePreferences', cuisine)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${preferences.dietary.cuisinePreferences.includes(cuisine)
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {cuisine}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        How often do you plan to eat out?
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'daily', label: 'Daily', desc: 'Most meals' },
                                            { value: 'weekdays', label: 'Weekdays', desc: 'Mon-Fri' },
                                            { value: 'occasional', label: 'Occasional', desc: 'Weekends' }
                                        ].map(({ value, label, desc }) => (
                                            <button
                                                key={value}
                                                onClick={() => updatePreference('dietary', 'mealFrequency', value)}
                                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${preferences.dietary.mealFrequency === value
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className="font-semibold">{label}</p>
                                                <p className="text-xs mt-1 text-gray-600">{desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                                        <Home className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Lifestyle Preferences</h3>
                                        <p className="text-gray-600">Tell us about your daily habits</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        How often do you cook?
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['never', 'sometimes', 'often', 'always'].map((freq) => (
                                            <button
                                                key={freq}
                                                onClick={() => updatePreference('lifestyle', 'cookingFrequency', freq)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${preferences.lifestyle.cookingFrequency === freq
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className="font-semibold capitalize">{freq}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Social Preference
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['quiet', 'moderate', 'social'].map((pref) => (
                                            <button
                                                key={pref}
                                                onClick={() => updatePreference('lifestyle', 'socialPreference', pref)}
                                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${preferences.lifestyle.socialPreference === pref
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className="font-semibold capitalize">{pref}</p>
                                                <p className="text-xs mt-1 text-gray-600">
                                                    {pref === 'quiet' ? 'Peace & privacy' :
                                                        pref === 'moderate' ? 'Some interaction' :
                                                            'Love community'}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Location Preferences</h3>
                                        <p className="text-gray-600">How close do you want to be to campus?</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Distance from Campus
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { value: 'on-campus', label: 'On Campus' },
                                            { value: '<0.5mi', label: '< 0.5 miles' },
                                            { value: '<1mi', label: '< 1 mile' },
                                            { value: 'any', label: 'Any Distance' }
                                        ].map(({ value, label }) => (
                                            <button
                                                key={value}
                                                onClick={() => updatePreference('proximity', 'campusDistance', value)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${preferences.proximity.campusDistance === value
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Food Distance Preference
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['walking', 'short-drive', 'any'].map((dist) => (
                                            <button
                                                key={dist}
                                                onClick={() => updatePreference('proximity', 'foodDistance', dist)}
                                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${preferences.proximity.foodDistance === dist
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <p className="font-semibold capitalize">{dist.replace('-', ' ')}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Cancel
                        </button>
                        <div className="flex items-center space-x-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Back</span>
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <span>{step === totalSteps ? 'Get Recommendations' : 'Next'}</span>
                                {step === totalSteps ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreferenceWizard
