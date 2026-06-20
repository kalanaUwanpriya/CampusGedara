import React, { useState, useMemo, useContext, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Users, ChevronRight, CheckCircle2, Ticket, Info, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useRecommendations } from '../../contexts/RecommendationContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';


const EVENT_THEMES = {
    indigo: {
        bgLight: 'from-indigo-50 to-white',
        blob: 'bg-indigo-200/40',
        iconBg: 'bg-indigo-100 border-indigo-200 text-indigo-600',
        badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        detailIcon: 'text-indigo-500',
        button: 'bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300 hover:bg-indigo-700',
    },
    pink: {
        bgLight: 'from-pink-50 to-white',
        blob: 'bg-pink-200/40',
        iconBg: 'bg-pink-100 border-pink-200 text-pink-600',
        badge: 'bg-pink-100 text-pink-700 border-pink-200',
        detailIcon: 'text-pink-500',
        button: 'bg-pink-600 shadow-pink-200 hover:shadow-pink-300 hover:bg-pink-700',
    },
    orange: {
        bgLight: 'from-orange-50 to-white',
        blob: 'bg-orange-200/40',
        iconBg: 'bg-orange-100 border-orange-200 text-orange-600',
        badge: 'bg-orange-100 text-orange-700 border-orange-200',
        detailIcon: 'text-orange-500',
        button: 'bg-orange-600 shadow-orange-200 hover:shadow-orange-300 hover:bg-orange-700',
    },
    emerald: {
        bgLight: 'from-emerald-50 to-white',
        blob: 'bg-emerald-200/40',
        iconBg: 'bg-emerald-100 border-emerald-200 text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        detailIcon: 'text-emerald-500',
        button: 'bg-emerald-600 shadow-emerald-200 hover:shadow-emerald-300 hover:bg-emerald-700',
    }
};

const EventDetailsModal = ({ event, allEvents = [], isOpen, onClose, onRegister, isRegistered: isInitiallyRegistered }) => {
    const { userInfo } = useContext(AuthContext);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isActuallyRegistered = isInitiallyRegistered || isSubmitted;
    const [formData, setFormData] = useState({
        fullName: userInfo?.name || '',
        studentId: userInfo?.studentId || '',
        email: userInfo?.email || '',
        phone: userInfo?.phone || ''
    });

    // Get suggested upcoming events within the SAME category
    const { history = [] } = useRecommendations();
    
    // Filter events the user has registered for
    const registeredEventIds = useMemo(() => 
        history.filter(item => item.type === 'registered').map(item => item.itemId),
    [history]);

    const upcomingEvents = useMemo(() => {
        if (!event || !allEvents || allEvents.length === 0) return [];
        
        return allEvents
            .filter(e => e.category === event.category && e._id !== event._id && !registeredEventIds.includes(e.name))
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
    }, [event?.name, allEvents, registeredEventIds]);

    React.useEffect(() => {
        if (!event) return;
        const handleCardAction = (e) => {
            if (e.detail.name === event.name && e.detail.action === 'register') {
                setIsRegistering(true);
            }
        };
        window.addEventListener('cardAction', handleCardAction);
        return () => window.removeEventListener('cardAction', handleCardAction);
    }, [event?.name]);

    // Move useEffect up here
    useEffect(() => {
        // Intercept back button to close modal instead of navigating away
        if (isOpen && event) {
            window.history.pushState({ modalOpen: true }, '');
        }

        const handlePopState = () => {
            handleClose(true);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isOpen, event]);

    if (!isOpen || !event) return null;

    const theme = EVENT_THEMES[event.color] || EVENT_THEMES.indigo;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const numbersOnly = value.replace(/[^0-9]/g, '');
            if (numbersOnly.length <= 10) {
                setFormData({ ...formData, [name]: numbersOnly });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setIsSubmitting(true);

        if (!userInfo || !userInfo.token) {
            setSubmitError("Please sign in to register for events.");
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                eventId: event._id || event.id, 
                eventName: event.name,
                eventDate: event.date,
                studentName: formData.fullName,
                studentEmail: formData.email,
                studentIdNumber: formData.studentId,
                phone: formData.phone,
                userId: userInfo._id
            };
            if (!userInfo?.token) return;
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const response = await axios.post('/api/event-registrations', payload, config);

            onRegister(event);
            setIsSubmitted(true);
        } catch (error) {
            setSubmitError(error.response?.data?.message || error.message || 'Failed to register');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (fromPopState = false) => {
        setIsRegistering(false);
        setIsSubmitted(false);
        setSubmitError('');
        setFormData({ 
            fullName: userInfo?.name || '', 
            studentId: userInfo?.studentId || '', 
            email: userInfo?.email || '', 
            phone: userInfo?.phone || '' 
        });
        onClose();
        if (fromPopState !== true) {
            window.history.back();
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex bg-white dark:bg-dark-bg animate-fade-in overflow-hidden transition-colors duration-500">
            <div className="w-full h-full flex flex-col md:flex-row animate-scale-in relative">

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-dark-card transition-all z-[110] border border-gray-100 dark:border-slate-800"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-dark-text-muted" />
                </button>

                {/* Left Side: Event Details & Highlights */}
                <div className={`w-full md:w-5/12 bg-gradient-to-br ${theme.bgLight} dark:from-dark-card dark:to-dark-bg border-r border-gray-100 dark:border-slate-800 p-8 flex flex-col relative overflow-y-auto custom-scrollbar ${isRegistering ? 'hidden md:flex' : 'flex'}`}>
                    {/* Event Header Image Background */}
                    {event.image && (
                        <div className="absolute top-0 left-0 w-full h-64 overflow-hidden opacity-10 blur-[2px] -z-10 pointer-events-none">
                            <img src={event.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-dark-bg" />
                        </div>
                    )}
                    <div className={`absolute top-0 right-0 w-48 h-48 ${theme.blob} dark:bg-dark-accent/10 rounded-full blur-3xl -z-10 -mt-10 -mr-10`} />

                    <div className="flex-1">
                        <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} dark:bg-dark-accent/10 dark:text-dark-accent dark:border-dark-accent/20 flex items-center justify-center mb-6 shadow-sm`}>
                            <Calendar className="w-8 h-8" />
                        </div>

                        <div className="mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge} dark:bg-dark-accent/20 dark:text-dark-accent dark:border-dark-accent/20 inline-block`}>
                                {event.organizer || 'Official'} Event
                            </span>
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 dark:text-dark-text-main mb-4 tracking-tight leading-tight">
                            {event.name}
                        </h2>

                        <p className="text-gray-600 dark:text-dark-text-muted leading-relaxed mb-8">
                            {event.description}
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text-main uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 pb-2 mb-4">
                                    Event Schedule
                                </h3>

                                <ul className="space-y-3">
                                    <li className="flex gap-3 items-center">
                                        <Clock className={`w-5 h-5 ${theme.detailIcon} dark:text-dark-accent shrink-0`} />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-dark-text-main text-sm">Time: {event.time || '9:00 AM - 4:00 PM'}</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3 items-center">
                                        <MapPin className={`w-5 h-5 ${theme.detailIcon} dark:text-dark-accent shrink-0`} />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-dark-text-main text-sm">Location: {event.location || 'Main Auditorium'}</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3 items-center">
                                        <Users className={`w-5 h-5 ${theme.detailIcon} dark:text-dark-accent shrink-0`} />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-dark-text-main text-sm">Eligibility: {event.eligibility || 'All Students'}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Past Year Highlights */}
                            {event.highlights && event.highlights.length > 0 && (
                                <div className="animate-fade-in-up">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text-main uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 pb-2 mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" />
                                        Past Year Highlights
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {event.highlights.map((img, idx) => (
                                            <div key={idx} className={`group relative h-24 rounded-xl overflow-hidden shadow-sm border border-white dark:border-slate-800 hover:border-gray-200 dark:hover:border-dark-accent transition-all ${idx === 0 ? 'col-span-2 h-40' : ''}`}>
                                                <img src={img} alt={`Highlight ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isActuallyRegistered && !isRegistering && (
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
                            <button
                                onClick={() => setIsRegistering(true)}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-white hover:-translate-y-0.5 ${theme.button} dark:bg-dark-accent dark:shadow-none dark:hover:bg-indigo-600`}
                            >
                                Register Now <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    {isActuallyRegistered && !isRegistering && !isSubmitted && (
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
                            <div className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-50 dark:bg-emerald-900/10 text-green-600 dark:text-emerald-400 border border-green-100 dark:border-emerald-900/20">
                                <CheckCircle2 className="w-5 h-5" /> Already Registered
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Registration & Post-Registration */}
                <div className={`flex-1 flex flex-col bg-white dark:bg-dark-card overflow-y-auto custom-scrollbar ${isRegistering ? 'block' : 'hidden md:block'}`}>
                    {isSubmitted ? (
                        <div className="flex-1 flex flex-col p-8 md:p-12 animate-fade-in">
                            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
                                <div className="w-24 h-24 bg-green-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-dark-text-main mb-4 tracking-tight">Registration Complete!</h2>
                                <p className="text-gray-600 dark:text-dark-text-muted text-lg mb-8">
                                    You're all set! We've sent your entry ticket to <span className="font-bold text-gray-800 dark:text-dark-text-main">{formData.email || 'your email'}</span>.
                                </p>

                                {/* What's Next Section */}
                                <div className="w-full bg-indigo-50/50 dark:bg-dark-bg/50 rounded-2xl p-6 mb-10 text-left border border-indigo-100/50 dark:border-slate-800">
                                    <h3 className="text-sm font-black text-indigo-900 dark:text-dark-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="w-4 h-4" /> What's Next?
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-sm text-indigo-800 dark:text-dark-text-muted">
                                            <div className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-dark-accent/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-indigo-800 dark:text-dark-accent">1</div>
                                            <p>Check your student email for the entry QR code.</p>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-indigo-800 dark:text-dark-text-muted">
                                            <div className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-dark-accent/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-indigo-800 dark:text-dark-accent">2</div>
                                            <p>Add this event to your calendar to receive a reminder 1 hour before.</p>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-indigo-800 dark:text-dark-text-muted">
                                            <div className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-dark-accent/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-indigo-800 dark:text-dark-accent">3</div>
                                            <p>Join the event's Discord channel for real-time updates.</p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="w-full h-px bg-gray-100 dark:bg-slate-800 mb-10" />

                                {/* Upcoming Events Section */}
                                <div className="w-full text-left">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-400" />
                                            More {event.category || 'Related'} Events
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {upcomingEvents.map((upcoming, idx) => (
                                            <div
                                                key={idx}
                                                className="group bg-gray-50 dark:bg-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-dark-accent hover:bg-white dark:hover:bg-dark-card transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
                                                onClick={() => {
                                                    setIsSubmitted(false);
                                                    setIsRegistering(false);
                                                    // This is a simplified way to navigate to next event in mock environment
                                                    const cardEvent = new CustomEvent('cardAction', {
                                                        detail: { name: upcoming.name, action: 'view' }
                                                    });
                                                    window.dispatchEvent(cardEvent);
                                                }}
                                            >
                                                <div className="aspect-video rounded-xl overflow-hidden mb-3">
                                                    <img src={upcoming.image} alt={upcoming.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-dark-text-main mb-1 group-hover:text-indigo-600 dark:group-hover:text-dark-accent transition-colors line-clamp-1">{upcoming.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-dark-text-muted line-clamp-2 leading-relaxed">
                                                    {upcoming.description}
                                                </p>
                                                <div className="mt-3 flex items-center text-indigo-600 dark:text-dark-accent text-[10px] font-bold uppercase tracking-widest gap-1">
                                                    View Details <ChevronRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="mt-12 text-sm font-bold text-gray-400 dark:text-dark-text-muted/40 hover:text-gray-600 dark:hover:text-dark-text-main transition-colors uppercase tracking-widest"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ) : isRegistering ? (
                        <div className="p-8 h-full flex flex-col max-w-2xl mx-auto w-full">
                            <div className="mb-8">
                                <button
                                    onClick={() => setIsRegistering(false)}
                                    className="text-sm font-semibold text-gray-500 dark:text-dark-text-muted hover:text-gray-800 dark:hover:text-dark-text-main flex items-center gap-1 mb-6 md:hidden"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Event Details
                                </button>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-xl ${theme.iconBg} dark:bg-dark-accent/10 dark:border-dark-accent/20 flex items-center justify-center shadow-sm`}>
                                        <Ticket className="w-5 h-5 dark:text-dark-accent" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main tracking-tight">Secure Your Spot</h3>
                                </div>
                                <p className="text-gray-500 dark:text-dark-text-muted text-sm">Join <span className="font-bold text-gray-700 dark:text-dark-text-main">{event.name}</span> by filling correctly.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-muted/60 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-dark-accent/10 focus:border-indigo-500 dark:focus:border-dark-accent bg-gray-50/50 dark:bg-dark-bg transition-all outline-none text-sm text-gray-900 dark:text-dark-text-main" placeholder="e.g. Malith Perera" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-muted/60 uppercase tracking-[0.2em] ml-1">Student ID</label>
                                        <input required type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-dark-accent/10 focus:border-indigo-500 dark:focus:border-dark-accent bg-gray-50/50 dark:bg-dark-bg transition-all outline-none text-sm text-gray-900 dark:text-dark-text-main" placeholder="IT22XXXXXX" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-muted/60 uppercase tracking-[0.2em] ml-1">Student Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-dark-accent/10 focus:border-indigo-500 dark:focus:border-dark-accent bg-gray-50/50 dark:bg-dark-bg transition-all outline-none text-sm text-gray-900 dark:text-dark-text-main" placeholder="it22xxxx@my.sliit.lk" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-dark-text-muted/60 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength="10" pattern="[0-9]{10}" title="Please enter exactly 10 digits" className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-dark-accent/10 focus:border-indigo-500 dark:focus:border-dark-accent bg-gray-50/50 dark:bg-dark-bg transition-all outline-none text-sm text-gray-900 dark:text-dark-text-main" placeholder="0712345678" />
                                </div>

                                {submitError && (
                                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-sm font-bold border border-rose-100 dark:border-rose-900/20">
                                        {submitError}
                                    </div>
                                )}

                                <div className="pt-8 flex gap-4 flex-col sm:flex-row">
                                    <button type="submit" disabled={isSubmitting} className={`flex-1 py-4 rounded-2xl font-black text-white shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} ${theme.button} dark:bg-dark-accent dark:hover:bg-indigo-600`}>
                                        {isSubmitting ? 'Confirming...' : 'Confirm Attendance'}
                                    </button>
                                </div>

                                <div className="pt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>Your data is only used for event attendance</span>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="p-10 h-full flex flex-col justify-center items-center text-center bg-gray-50 dark:bg-dark-card relative overflow-hidden">
                            <div className="absolute inset-0 bg-white dark:bg-dark-card bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${theme.blob} dark:bg-dark-accent/10 rounded-full blur-[120px] opacity-20`} />

                            <div className="relative z-10 max-w-sm animate-fade-in-up">
                                <div className={`w-24 h-24 mx-auto rounded-[2rem] bg-white dark:bg-dark-bg border border-gray-100 dark:border-slate-800 shadow-2xl shadow-gray-200/50 dark:shadow-none flex items-center justify-center mb-8 rotate-3 hover:rotate-12 transition-all duration-500`}>
                                    {isActuallyRegistered ? (
                                        <CheckCircle2 className={`w-12 h-12 text-green-500`} />
                                    ) : (
                                        <Ticket className={`w-12 h-12 ${theme.detailIcon} dark:text-dark-accent`} />
                                    )}
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-dark-text-main mb-4 tracking-tight">
                                    {isActuallyRegistered ? "You're all set!" : "Join the experience!"}
                                </h3>
                                <p className="text-gray-600 dark:text-dark-text-muted mb-10 leading-relaxed text-lg">
                                    {isActuallyRegistered
                                        ? "You are already registered for this event. Check the details on the left for the schedule and location."
                                        : "Don't miss out on this incredible opportunity to learn, network, and enjoy. Spots are limited."
                                    }
                                </p>
                                {!isActuallyRegistered && (
                                    <button
                                        onClick={() => setIsRegistering(true)}
                                        className={`w-full py-5 rounded-2xl font-black text-white shadow-2xl hover:-translate-y-1 active:translate-y-0 shadow-indigo-200 dark:shadow-none transition-all text-lg ${theme.button} dark:bg-dark-accent dark:hover:bg-indigo-600`}
                                    >
                                        Grab Your Free Spot
                                    </button>
                                )}
                                <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 dark:text-dark-text-muted/60 uppercase tracking-[0.2em]">
                                    {!isActuallyRegistered && <Sparkles className="w-4 h-4 text-amber-400" />}
                                    <span>{isActuallyRegistered ? "Confirmed Registration" : "Limited Seats Remaining"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
