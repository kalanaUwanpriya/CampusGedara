import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Book, Trophy, Users as UsersIcon, Monitor, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SectionHeader from '../components/shared/SectionHeader';
import Card from '../components/shared/Card';
import { useRecommendations } from '../contexts/RecommendationContext';
import RecommendedSection from '../components/recommendations/RecommendedSection';
import AIEventChatbox from '../components/recommendations/AIEventChatbox';
import EventDetailsModal from '../components/events/EventDetailsModal';

const EventsPage = () => {
    const { getRecommendations, trackInteraction, history = [], interests } = useRecommendations();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allEvents, setAllEvents] = useState([]);
    const [groupedEvents, setGroupedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAiFiltered, setIsAiFiltered] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/events');
                const data = response.data;
                setIsAiFiltered(Array.isArray(interests) && interests.length > 0);

                const resData = Array.isArray(data) ? data : [];
                setAllEvents(resData);

                // Group events by category
                const groups = resData.reduce((acc, event) => {
                    const category = event.category || 'Other';
                    if (!acc[category]) {
                        acc[category] = {
                            category: category,
                            icon: category === 'IT Tech Event' ? 'Monitor' : 
                                  category === 'Annual Event' ? 'Trophy' : 
                                  category === 'Management Event' ? 'Book' : 
                                  category === 'Exhibition' ? 'Sparkles' : 'Calendar',
                            color: category === 'IT Tech Event' ? 'indigo' : 
                                   category === 'Annual Event' ? 'pink' : 
                                   category === 'Management Event' ? 'emerald' : 
                                   category === 'Exhibition' ? 'orange' : 'rose',
                            events: []
                        };
                    }
                    acc[category].events.push(event);
                    return acc;
                }, {});

                setGroupedEvents(Object.values(groups));
                setError(null);
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events. Please check if the server is running and try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [interests]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
        trackInteraction(event, 'viewed');
    };

    const handleRegister = (event) => {
        trackInteraction(event, 'registered');
    };

    // Filter events the user has registered for
    const registeredEventIds = history
        .filter(item => item.type === 'registered')
        .map(item => item.itemId);

    // Get unique registered events
    const registeredEvents = allEvents.filter(event => registeredEventIds.includes(event.name));

    // Get recommendations
    const recommendedEvents = getRecommendations(Array.isArray(allEvents) ? allEvents : [], 3);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors duration-500">
            {/* Spacer for transparent navbar area to retain exactly the same look */}
            <div className="h-20 w-full shrink-0"></div>

            {/* Main Content Area with requested Gradient */}
            <div className="flex-1 bg-gradient-to-br from-[#8ca0b3] via-[#cbdbe8] to-[#eaf2f7] dark:from-slate-900 dark:to-slate-800 pt-8 pb-20">
                <AIEventChatbox />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 relative">
                    {isAiFiltered && (
                         <div className="absolute top-0 right-0 -mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 animate-fade-in-up">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Curated
                         </div>
                    )}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-lg shadow-pink-300/40 dark:shadow-none mb-8 mx-auto">
                        <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-dark-text-main mb-6 tracking-tight">
                        Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 dark:from-dark-accent dark:to-purple-400">Events</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-dark-text-muted leading-relaxed mb-8">
                        Stay up to date with the latest workshops, competitions, and celebrations happening around the campus.
                    </p>
                </div>

                {/* Registered Events Section (Dynamic) */}
                {registeredEvents.length > 0 ? (
                    <div className="mb-20">
                        <RecommendedSection
                            items={registeredEvents}
                            color="rose"
                            title="My Registrations"
                            onItemClick={handleEventClick}
                            hideCardButton={true}
                        />
                    </div>
                ) : null}

                {/* Recommended Section rendering */}
                <RecommendedSection
                    items={recommendedEvents}
                    color="pink"
                    title="Recommended Events"
                    onItemClick={handleEventClick}
                    hideCardButton={false}
                />

                {/* Categories and Events */}
                <div className="space-y-20">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 border-4 border-pink-500 dark:border-dark-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-dark-text-muted font-medium">Loading events...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-rose-50 dark:bg-red-900/10 rounded-[2rem] border border-rose-100 dark:border-red-900/20">
                             <Calendar className="w-12 h-12 text-rose-300 dark:text-rose-400/30 mx-auto mb-4" />
                             <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                             <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-rose-600 dark:bg-dark-accent text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 dark:shadow-none">
                                 Try Again
                             </button>
                        </div>
                    ) : groupedEvents.length > 0 ? (
                        groupedEvents.map((categoryData, idx) => (
                            <section key={idx} className="relative">
                                <SectionHeader
                                    title={categoryData.category}
                                    iconName={categoryData.icon}
                                    color={categoryData.color}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {categoryData.events.map((event, eventIdx) => (
                                        <div key={eventIdx} onClick={() => handleEventClick(event)} className="cursor-pointer">
                                            <Card
                                                item={{
                                                    ...event,
                                                    color: categoryData.color // Pass theme color to card
                                                }}
                                                color={categoryData.color}
                                                hideButton={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800">
                             <Calendar className="w-12 h-12 text-gray-300 dark:text-dark-text-muted/20 mx-auto mb-4" />
                             <p className="text-gray-500 dark:text-dark-text-muted font-medium">No campus events found at the moment.</p>
                             <p className="text-sm text-gray-400 dark:text-dark-text-muted/40 mt-2">Check back later for new activities!</p>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <EventDetailsModal
                    event={selectedEvent}
                    allEvents={allEvents}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onRegister={handleRegister}
                    isRegistered={selectedEvent ? registeredEventIds.includes(selectedEvent.name) : false}
                />

                {/* Bottom CTA */}
                <div className="mt-24 text-center bg-white dark:bg-dark-card rounded-3xl p-12 shadow-xl shadow-pink-100/50 dark:shadow-none border border-pink-50 dark:border-slate-800 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-dark-accent dark:to-purple-900 rounded-full blur-3xl opacity-50 dark:opacity-20" />
                    <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-indigo-900 dark:to-dark-accent rounded-full blur-3xl opacity-50 dark:opacity-20" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-main mb-4">Don't miss out!</h2>
                        <p className="text-gray-600 dark:text-dark-text-muted mb-8 max-w-xl mx-auto">
                            Subscribe to our newsletter to get weekly updates on upcoming events directly in your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your student email"
                                className="px-6 py-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:focus:ring-dark-accent/20 focus:border-pink-500 dark:focus:border-dark-accent w-full"
                            />
                            <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 dark:from-dark-accent dark:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 dark:shadow-none hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 shrink-0">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </div>
    );
};

export default EventsPage;
