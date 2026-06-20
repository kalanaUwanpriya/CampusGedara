import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    BookOpen, Calendar, Library, Home, ArrowRight,
    Star, Users, Zap, Shield, ChevronDown, GraduationCap,
    MapPin, Clock, Award, HeartHandshake, Sparkles, TrendingUp,
    UtensilsCrossed, Bookmark, FileText
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

/* ── animated floating particles ───────────────────────── */
const Particle = ({ style }) => (
    <div
        className="absolute rounded-full opacity-20 animate-pulse pointer-events-none"
        style={style}
    />
)

/* ── single stat card ───────────────────────────────────── */
const StatCard = ({ number, label, icon: Icon, color }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-dark-card shadow-lg dark:shadow-none hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-slate-800 group`}>
        <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${color} dark:bg-dark-accent opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
        <Icon className={`w-7 h-7 mb-4 ${color.replace('bg-', 'text-').replace('-100', '-500')} dark:text-dark-accent`} />
        <div className="text-3xl font-black text-gray-900 dark:text-dark-text-main mb-1">{number}</div>
        <div className="text-sm text-gray-500 dark:text-dark-text-muted font-medium">{label}</div>
    </div>
)

/* ── feature card ───────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, gradient, delay }) => (
    <div
        className="group relative overflow-hidden rounded-3xl p-8 bg-white dark:bg-dark-card border border-gray-100 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        style={{ animationDelay: delay }}
    >
        <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main mb-3 group-hover:text-indigo-600 dark:group-hover:text-dark-accent transition-colors duration-300">{title}</h3>
        <p className="text-gray-500 dark:text-dark-text-muted text-sm leading-relaxed">{description}</p>
        <div className="mt-6 flex items-center text-indigo-500 dark:text-dark-accent text-sm font-semibold opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
            Explore <ArrowRight className="w-4 h-4 ml-1" />
        </div>
    </div>
)

/* ── subsystem card ─────────────────────────────────────── */
const SubsystemCard = ({ to, icon: Icon, label, description, gradient, badge }) => (
    <Link
        to={to}
        className="group relative overflow-hidden rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer block"
    >
        <div className={`absolute inset-0 ${gradient}`} />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
        {/* decorative circle */}
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
        <div className="relative p-8 text-white">
            {badge && (
                <span className="inline-block px-3 py-1 text-xs font-bold bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                    {badge}
                </span>
            )}
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight italic uppercase">{label}</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">{description}</p>
            <div className="flex items-center text-white font-black text-xs uppercase tracking-widest bg-white/20 w-fit px-4 py-2 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
        </div>
    </Link>
)

/* ── saved card (generic for mini) ───────────────────────── */
const SavedItemCard = ({ item, typeIcon: TypeIcon, typeLabel }) => (
    <Link
        to={item.link || "/living"}
        className="group flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-dark-bg">
            <img
                src={item.image}
                alt={item.name || item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-dark-text-main text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-dark-accent transition-colors">
                {item.name || item.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-dark-text-muted truncate">{item.type || item.author || item.location}</p>
            <div className="flex items-center gap-2 mt-1">
                 {item.rating ? (
                     <>
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-dark-text-main">{item.rating}</span>
                     </>
                 ) : (
                     TypeIcon && <TypeIcon className="w-3 h-3 text-indigo-500 dark:text-dark-accent" />
                 )}
                 <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-muted/60 uppercase tracking-widest">{typeLabel}</span>
            </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-dark-text-muted/30 group-hover:text-indigo-500 dark:group-hover:text-dark-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
    </Link>
)

const HomePage = () => {
    const { userInfo } = useContext(AuthContext)
    const [typedText, setTypedText] = useState('')
    const words = ['Easier.', 'Smarter.', 'Better.']
    const [wordIndex, setWordIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)
    const [savedRestaurants, setSavedRestaurants] = useState([])
    const [savedAccommodations, setSavedAccommodations] = useState([])
    const [savedNotes, setSavedNotes] = useState([])
    const [activeReminders, setActiveReminders] = useState([])

    useEffect(() => {
        const current = words[wordIndex]
        const speed = deleting ? 60 : 110
        const timer = setTimeout(() => {
            if (!deleting) {
                setTypedText(current.slice(0, charIndex + 1))
                if (charIndex + 1 === current.length) {
                    setTimeout(() => setDeleting(true), 1500)
                } else {
                    setCharIndex(c => c + 1)
                }
            } else {
                setTypedText(current.slice(0, charIndex - 1))
                if (charIndex <= 1) {
                    setDeleting(false)
                    setWordIndex(i => (i + 1) % words.length)
                    setCharIndex(0)
                } else {
                    setCharIndex(c => c - 1)
                }
            }
        }, speed)
        return () => clearTimeout(timer)
    }, [charIndex, deleting, wordIndex])

    useEffect(() => {
        const fetchSaved = async () => {
            if (!userInfo?.foodBookmarks?.length) {
                setSavedRestaurants([])
                return
            }
            try {
                const { data } = await axios.get('/api/food-services')
                const saved = data
                    .filter(r => userInfo.foodBookmarks.includes(r._id))
                    .map(r => ({
                        id: r._id,
                        name: r.restaurantName,
                        type: r.locationType,
                        rating: (r.rating && r.rating > 0) ? Number(r.rating).toFixed(1) : 'New',
                        operatingHours: r.operatingHours || 'Open',
                        image: (r.images && r.images.length > 0) ? r.images[0] : 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80',
                    }))
                setSavedRestaurants(saved)
            } catch {
                setSavedRestaurants([])
            }
        }
        fetchSaved()
    }, [userInfo?.foodBookmarks])

    useEffect(() => {
        const fetchSavedAcc = async () => {
            if (!userInfo?.accommodationBookmarks?.length) {
                setSavedAccommodations([])
                return
            }
            try {
                const { data } = await axios.get('/api/accommodations')
                const saved = data
                    .filter(acc => userInfo.accommodationBookmarks.includes(acc._id))
                    .map(acc => ({
                        id: acc._id,
                        name: acc.buildingName || 'Shared Accommodation',
                        location: acc.distance ? `${acc.distance} miles` : 'On Campus',
                        price: `Rs. ${Number(acc.price || 0).toLocaleString()}`,
                        type: acc.type || 'Stay',
                        image: (acc.images && acc.images.length > 0) ? acc.images[0] : (acc.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80'),
                    }))
                setSavedAccommodations(saved)
            } catch {
                setSavedAccommodations([])
            }
        }
        fetchSavedAcc()
    }, [userInfo?.accommodationBookmarks])

    useEffect(() => {
        const fetchSavedNotes = async () => {
            if (!userInfo?.noteBookmarks?.length) {
                setSavedNotes([])
                return
            }
            try {
                const { data } = await axios.get('/api/study-materials')
                const saved = data
                    .filter(m => userInfo.noteBookmarks.includes(m._id))
                    .map(m => ({
                        id: m._id,
                        title: m.title,
                        author: m.author,
                        type: m.type,
                        image: m.coverImage || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80',
                    }))
                setSavedNotes(saved)
            } catch {
                setSavedNotes([])
            }
        }
        fetchSavedNotes()
    }, [userInfo?.noteBookmarks])

    useEffect(() => {
        const fetchReminders = async () => {
            if (!userInfo?.token) {
                setActiveReminders([])
                return
            }
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/lecture-reminders', config);
                setActiveReminders(Array.isArray(data) ? data : []);
            } catch {
                setActiveReminders([])
            }
        }
        fetchReminders()
    }, [userInfo?.token])

    const stats = [
        { number: '12,000+', label: 'Active Students', icon: Users, color: 'bg-blue-100' },
        { number: '500+', label: 'Study Resources', icon: BookOpen, color: 'bg-purple-100' },
        { number: '200+', label: 'Campus Events', icon: Calendar, color: 'bg-pink-100' },
        { number: '98%', label: 'Satisfaction Rate', icon: Star, color: 'bg-amber-100' },
    ]

    const features = [
        {
            icon: Zap,
            title: 'Smart Recommendations',
            description: 'AI-powered suggestions for accommodation, food packages, and study materials tailored to your needs.',
            gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
            delay: '0ms'
        },
        {
            icon: Shield,
            title: 'Verified Listings',
            description: 'All accommodation, transport, and dining options are vetted and reviewed by real students.',
            gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500',
            delay: '100ms'
        },
        {
            icon: TrendingUp,
            title: 'Academic Tracking',
            description: 'Keep on top of your coursework, deadlines, and study sessions with integrated academic tools.',
            gradient: 'bg-gradient-to-br from-indigo-400 to-violet-500',
            delay: '200ms'
        },
        {
            icon: HeartHandshake,
            title: 'Community First',
            description: 'Connect with fellow students and participate in campus events that matter to you.',
            gradient: 'bg-gradient-to-br from-rose-400 to-pink-500',
            delay: '300ms'
        },
    ]

    const subsystems = [
        {
            to: '/study',
            icon: BookOpen,
            label: 'Study',
            description: 'Access lecture notes, past papers, timetables, and AI study tools to ace every semester.',
            gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600',
            badge: 'Academic'
        },
        {
            to: '/events',
            icon: Calendar,
            label: 'Events',
            description: 'Discover and register for campus events, workshops, and cultural activities.',
            gradient: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500',
            badge: 'Social'
        },
        {
            to: '/resources',
            icon: Library,
            label: 'Resources',
            description: 'Find library books, lab equipment, study rooms, and all campus facilities in one place.',
            gradient: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600',
            badge: 'Facilities'
        },
        {
            to: '/living',
            icon: Home,
            label: 'Living',
            description: 'Everything for campus living — accommodation, food, transport, and well-being support.',
            gradient: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-400',
            badge: 'Lifestyle'
        },
    ]

    const particles = [
        { width: 80, height: 80, background: 'radial-gradient(circle, #6366f1, transparent)', top: '10%', left: '5%' },
        { width: 120, height: 120, background: 'radial-gradient(circle, #ec4899, transparent)', top: '60%', left: '2%' },
        { width: 60, height: 60, background: 'radial-gradient(circle, #8b5cf6, transparent)', top: '30%', right: '8%' },
        { width: 100, height: 100, background: 'radial-gradient(circle, #06b6d4, transparent)', bottom: '20%', right: '3%' },
    ]

    return (
        <div className="relative overflow-hidden bg-white dark:bg-dark-bg transition-colors duration-500">
            {/* ─── HERO ──────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 sm:px-6">
                {/* background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg transition-colors duration-500" />
                {/* mesh overlay */}
                <div
                    className="absolute inset-0 opacity-30 dark:opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(at 40% 20%, hsla(228,100%,74%,0.3) 0px, transparent 50%),
                                          radial-gradient(at 80% 0%, hsla(289,100%,76%,0.25) 0px, transparent 50%),
                                          radial-gradient(at 0% 50%, hsla(355,100%,93%,0.3) 0px, transparent 50%),
                                          radial-gradient(at 80% 50%, hsla(340,100%,76%,0.2) 0px, transparent 50%),
                                          radial-gradient(at 0% 100%, hsla(22,100%,77%,0.2) 0px, transparent 50%),
                                          radial-gradient(at 80% 100%, hsla(242,100%,70%,0.3) 0px, transparent 50%)`
                    }}
                />
                
                {particles.map((p, i) => (
                    <Particle key={i} style={{ width: p.width, height: p.height, background: p.background, top: p.top, left: p.left, right: p.right, bottom: p.bottom, position: 'absolute', animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i}s` }} />
                ))}

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-full border border-indigo-200 dark:border-slate-800 shadow-md text-sm font-bold text-indigo-600 dark:text-dark-accent mb-8 animate-bounce-slow">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Sri Lanka's #1 University Companion Platform
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-dark-text-main leading-tight mb-6 tracking-tight">
                        Campus Life,{' '}
                        <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-dark-accent dark:to-purple-400 bg-clip-text text-transparent italic">
                            Made&nbsp;{typedText}
                            <span className="inline-block w-1 h-14 ml-1 bg-indigo-500 dark:bg-dark-accent rounded-full animate-pulse align-middle" />
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-500 dark:text-dark-text-muted max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                        <strong className="text-gray-700 dark:text-dark-text-main">campusgedara</strong> brings together everything a Sri Lankan university student needs in one stunning experience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            to="/living"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-dark-accent dark:to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-300/40 dark:shadow-none hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 text-base"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/about"
                            className="flex items-center gap-2 px-8 py-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm text-gray-700 dark:text-dark-text-main font-bold rounded-2xl border border-gray-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:bg-white dark:hover:bg-dark-card transition-all duration-300 hover:scale-105 text-base"
                        >
                            Learn More
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <div className="flex -space-x-3">
                            {['bg-indigo-400', 'bg-purple-400', 'bg-pink-400', 'bg-amber-400', 'bg-teal-400'].map((c, i) => (
                                <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white dark:border-dark-bg flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="flex text-amber-400 text-xs">★★★★★</div>
                            <p className="text-xs text-gray-500 dark:text-dark-text-muted font-bold">Loved by 12,000+ students</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-dark-text-muted/40 animate-bounce cursor-pointer">
                    <span className="text-xs font-black tracking-widest uppercase">Scroll</span>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </section>

            {/* ─── STATS STRIP ───────────────────────────────────────── */}
            <section className="py-16 px-4 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-slate-800 transition-colors duration-500">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>
            </section>

            {/* ─── SAVED SECTIONS ────────────────────────────────── */}
            <div className="space-y-0.5 bg-gray-100 dark:bg-slate-900 transition-colors duration-500">
                {savedRestaurants.length > 0 && (
                    <section className="py-14 px-4 sm:px-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-dark-bg dark:to-dark-bg border-b border-orange-100 dark:border-slate-800 transition-colors duration-500">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                                        <UtensilsCrossed className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main uppercase tracking-tight italic">Favourite Dining</h2>
                                        <p className="text-sm text-gray-500 dark:text-dark-text-muted font-medium">Your favoured campus spots</p>
                                    </div>
                                </div>
                                <Link to="/living" className="flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-dark-accent bg-white dark:bg-dark-card px-4 py-2 rounded-xl border border-orange-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                    <Bookmark className="w-4 h-4" /> View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedRestaurants.map(r => <SavedItemCard key={r.id} item={r} typeLabel="Restaurant" typeIcon={UtensilsCrossed} />)}
                            </div>
                        </div>
                    </section>
                )}

                {savedAccommodations.length > 0 && (
                    <section className="py-14 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-dark-bg dark:to-dark-bg border-b border-indigo-100 dark:border-slate-800 transition-colors duration-500">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                        <Home className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main uppercase tracking-tight italic">Saved Stays</h2>
                                        <p className="text-sm text-gray-500 dark:text-dark-text-muted font-medium">Your potential new homes</p>
                                    </div>
                                </div>
                                <Link to="/living" className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-dark-accent bg-white dark:bg-dark-card px-4 py-2 rounded-xl border border-indigo-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                    <Bookmark className="w-4 h-4" /> View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedAccommodations.map(acc => <SavedItemCard key={acc.id} item={acc} typeLabel="Stay" typeIcon={Home} />)}
                            </div>
                        </div>
                    </section>
                )}

                {savedNotes.length > 0 && (
                    <section className="py-14 px-4 sm:px-6 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-purple-50 dark:from-dark-bg dark:to-dark-bg border-b border-violet-100 dark:border-slate-800 transition-colors duration-500">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-md">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main uppercase tracking-tight italic">Curated Library</h2>
                                        <p className="text-sm text-gray-500 dark:text-dark-text-muted font-medium">Your top study resources</p>
                                    </div>
                                </div>
                                <Link to="/study" className="flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-dark-accent bg-white dark:bg-dark-card px-4 py-2 rounded-xl border border-violet-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                    <Bookmark className="w-4 h-4" /> View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedNotes.map(note => <SavedItemCard key={note.id} item={note} typeLabel="Resources" typeIcon={FileText} />)}
                            </div>
                        </div>
                    </section>
                )}

                {activeReminders.length > 0 && (
                    <section className="py-14 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-slate-50 to-white dark:from-dark-bg dark:to-dark-bg border-b border-indigo-100 dark:border-slate-800 transition-colors duration-500">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-md">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main uppercase tracking-tight italic">Active Reminders</h2>
                                        <p className="text-sm text-gray-500 dark:text-dark-text-muted font-medium">Your upcoming academic goals</p>
                                    </div>
                                </div>
                                <Link to="/study" className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-dark-accent bg-white dark:bg-dark-card px-4 py-2 rounded-xl border border-indigo-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                    <Clock className="w-4 h-4" /> Go to Hub
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeReminders.slice(0, 3).map(reminder => (
                                    <Link
                                        key={reminder._id}
                                        to="/study"
                                        className="group relative bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                                reminder.academicType === 'Assignment' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                reminder.academicType === 'Mid Exam' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {reminder.academicType}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{reminder.moduleCode}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-dark-text-main text-sm mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                            {reminder.lectureTitle || 'Study Session'}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(reminder.reminderTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* ─── SUBSYSTEMS ────────────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-dark-bg dark:to-dark-bg border-b dark:border-slate-800 transition-colors duration-500">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-dark-accent/10 text-indigo-600 dark:text-dark-accent rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            Everything In One Place
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-dark-text-main mb-4 tracking-tight">
                            Your Campus,{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-dark-accent dark:to-indigo-400 bg-clip-text text-transparent italic">Simplified</span>
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text-muted text-lg max-w-2xl mx-auto font-medium">
                            Navigate every aspect of university life from one unified hub built for the modern student.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subsystems.map((s) => (
                            <SubsystemCard key={s.label} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ──────────────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 bg-white dark:bg-dark-card transition-colors duration-500">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-purple-100 dark:bg-dark-accent/10 text-purple-600 dark:text-dark-accent rounded-full text-xs font-black uppercase tracking-widest mb-4">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-dark-text-main mb-4 tracking-tight">
                            Built for <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-dark-accent dark:to-purple-400 bg-clip-text text-transparent italic">Success</span>
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text-muted text-lg max-w-2xl mx-auto font-medium">Every feature is designed with your student journey in mind.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f) => (
                            <FeatureCard key={f.title} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg relative overflow-hidden transition-colors duration-500 border-y dark:border-slate-800">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative max-w-4xl mx-auto text-center text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                        {[
                            { step: '01', icon: GraduationCap, title: 'Create Profile', desc: 'Sign up and set your university preferences in seconds.' },
                            { step: '02', icon: Sparkles, title: 'Discover & Map', desc: 'Explore the best of campus dining, homes and study spots.' },
                            { step: '03', icon: Award, title: 'Ace Campus Life', desc: 'Stay organised and ahead of the curve throughout the year.' },
                        ].map(({ step, icon: Icon, title, desc }) => (
                            <div key={step} className="flex flex-col items-center">
                                <div className="relative w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-white/30">
                                    <Icon className="w-8 h-8 text-white" />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-indigo-600 text-xs font-black rounded-full flex items-center justify-center shadow">
                                        {step.slice(1)}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{title}</h3>
                                <p className="text-white/75 text-sm leading-relaxed font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight italic">Transform your student experience.</h2>
                    <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto font-medium">Join thousands of students finding their path with campusgedara.</p>
                    <Link to="/living" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-600 dark:text-dark-accent font-black rounded-2xl shadow-2xl hover:scale-105 transition-all text-lg uppercase tracking-widest">
                        Start Now <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* ─── QUICK INFO STRIP ──────────────────────────────────── */}
            <section className="py-12 px-4 bg-white dark:bg-dark-card transition-colors duration-500">
                <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
                    {[
                        { icon: MapPin, text: 'Across Island-wide Universities' },
                        { icon: Clock, text: 'Round-the-clock Support' },
                        { icon: Shield, text: 'Vetted & Student-Verified' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3 text-gray-500 dark:text-dark-text-muted text-sm font-black uppercase tracking-wide">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-dark-accent/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-indigo-500 dark:text-dark-accent" />
                            </div>
                            {text}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default HomePage
