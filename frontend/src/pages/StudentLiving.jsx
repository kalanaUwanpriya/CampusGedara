import { useState } from 'react'
import { Building2, UtensilsCrossed, Bus, Sparkles } from 'lucide-react'
import AccommodationList from '../components/accommodation/AccommodationList'
import FoodList from '../components/food/FoodList'
import TransportationList from '../components/transportation/TransportationList'
import PackageRecommendations from './PackageRecommendations'

const StudentLiving = () => {
    const [activeTab, setActiveTab] = useState('accommodation')
    const [visitedTabs, setVisitedTabs] = useState(['accommodation'])

    const handleTabChange = (id) => {
        setActiveTab(id)
        if (!visitedTabs.includes(id)) {
            setVisitedTabs(prev => [...prev, id])
        }
    }

    const tabs = [
        {
            id: 'packages',
            label: 'Smart Packages',
            icon: Sparkles,
            description: 'AI-Powered Recommendations'
        },
        {
            id: 'accommodation',
            label: 'Accommodation',
            icon: Building2,
            description: 'Find Your Perfect Place'
        },
        {
            id: 'food',
            label: 'Food & Dining',
            icon: UtensilsCrossed,
            description: 'Explore Campus Dining'
        },
        {
            id: 'transportation',
            label: 'Transportation',
            icon: Bus,
            description: 'Campus Routes & Schedules'
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors duration-500">
            {/* Spacer for transparent navbar area to retain exactly the same look */}
            <div className="h-20 w-full shrink-0"></div>

            {/* Main Content Area with requested Gradient */}
            <div className="flex-1 bg-gradient-to-br from-[#8ca0b3] via-[#cbdbe8] to-[#eaf2f7] dark:from-slate-900 dark:to-slate-800 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl md:text-5xl font-bold text-gray-900 dark:text-dark-text-main mb-4">
                        Student Living & Well-being
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-dark-text-muted max-w-3xl mx-auto">
                        Everything you need for a comfortable campus life - from finding the perfect
                        accommodation to discovering great food and navigating transportation options.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-2xl p-2 mb-8 animate-slide-up shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {tabs.map(({ id, label, icon: Icon, description }) => (
                            <button
                                key={id}
                                onClick={() => handleTabChange(id)}
                                className={`p-6 rounded-xl transition-all duration-300 ${activeTab === id
                                    ? 'bg-indigo-600 dark:bg-dark-accent text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-[1.02]'
                                    : 'bg-transparent text-slate-600 dark:text-dark-text-muted hover:bg-slate-50 dark:hover:bg-dark-bg'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${activeTab === id
                                        ? 'bg-white/20'
                                        : 'bg-indigo-50 dark:bg-dark-bg'
                                        }`}>
                                        <Icon className={`w-7 h-7 ${activeTab === id ? 'text-white' : 'text-indigo-600 dark:text-dark-accent'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold text-lg ${activeTab === id ? 'text-white' : 'text-gray-900 dark:text-dark-text-main'
                                            }`}>
                                            {label}
                                        </h3>
                                        <p className={`text-sm mt-1 ${activeTab === id ? 'text-white/80' : 'text-slate-500 dark:text-dark-text-muted'
                                            }`}>
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {visitedTabs.includes('packages') && (
                        <div className={activeTab === 'packages' ? 'block' : 'hidden'}>
                            <PackageRecommendations />
                        </div>
                    )}
                    {visitedTabs.includes('accommodation') && (
                        <div className={activeTab === 'accommodation' ? 'block' : 'hidden'}>
                            <AccommodationList />
                        </div>
                    )}
                    {visitedTabs.includes('food') && (
                        <div className={activeTab === 'food' ? 'block' : 'hidden'}>
                            <FoodList />
                        </div>
                    )}
                    {visitedTabs.includes('transportation') && (
                        <div className={activeTab === 'transportation' ? 'block' : 'hidden'}>
                            <TransportationList />
                        </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}

export default StudentLiving
