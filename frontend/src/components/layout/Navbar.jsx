import { useState, useEffect, useContext, useRef } from 'react'
import { Menu, X, GraduationCap, User, LogOut, Settings, Bell, Sparkles, Clock, QrCode } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const location = useLocation()
    const { userInfo, logout } = useContext(AuthContext)
    const menuRef = useRef(null)
    const notifRef = useRef(null)
    const [notifications, setNotifications] = useState([])
    const [showNotifs, setShowNotifs] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false)
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifs(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (!userInfo?.token) return;
        const fetchNotifs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5001/api/notifications', config);
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [userInfo]);

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Error marking read:", err);
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/study', label: 'Study' },
        { to: '/events', label: 'Events' },
        { to: '/resources', label: 'Resources' },
        { to: '/living', label: 'Living' },
        { to: '/about', label: 'About' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl shadow-lg shadow-indigo-100/50 dark:shadow-none border-b border-indigo-100 dark:border-slate-800'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-400/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
                                campus<span className="text-indigo-900 dark:text-slate-200">gedara</span>
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-dark-text-muted font-medium tracking-widest uppercase">University Hub</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={label}
                                to={to}
                                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${isActive(to)
                                    ? 'text-indigo-600 dark:text-dark-accent'
                                    : 'text-gray-600 dark:text-dark-text-muted hover:text-indigo-600 dark:hover:text-dark-accent'
                                    }`}
                            >
                                <span className={`absolute inset-0 rounded-xl transition-all duration-300 ${isActive(to)
                                    ? 'bg-indigo-50 dark:bg-dark-accent/10 shadow-sm'
                                    : 'bg-transparent group-hover:bg-indigo-50/60 dark:group-hover:bg-dark-accent/5'
                                    }`} />
                                <span className="relative">{label}</span>
                                {isActive(to) && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-dark-accent rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button / Profile Dropdown */}
                    <div className="hidden md:flex items-center space-x-3">
                        {userInfo && (
                            <div className="relative mr-2" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifs(!showNotifs)}
                                    className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-accent/5 hover:bg-indigo-50 dark:hover:bg-dark-accent/10 transition-all relative group"
                                >
                                    <Bell size={20} className={unreadCount > 0 ? "text-indigo-600 dark:text-dark-accent animate-swing" : "text-gray-500 dark:text-dark-text-muted"} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-dark-bg">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifs && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-dark-card rounded-[1.5rem] shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 border-b border-indigo-50 dark:border-slate-800 bg-indigo-50/30 dark:bg-dark-accent/5 flex items-center justify-between">
                                            <h3 className="text-sm font-black text-indigo-900 dark:text-dark-text-main uppercase tracking-widest">Notifications</h3>
                                            {unreadCount > 0 && <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                                        </div>
                                        <div className="max-h-[350px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div 
                                                        key={n._id} 
                                                        onClick={() => markAsRead(n._id)}
                                                        className={`p-4 border-b border-gray-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-dark-accent/5 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-indigo-50/20 dark:bg-dark-accent/5' : ''}`}
                                                    >
                                                        {!n.isRead && <div className="absolute top-5 left-2 w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                                                        <div className="flex gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'Booking Reminder' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                {n.type === 'Booking Reminder' ? <Clock size={16} /> : <Sparkles size={16} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-black text-gray-900 dark:text-dark-text-main mb-0.5">{n.title}</p>
                                                                <p className="text-[11px] text-gray-500 dark:text-dark-text-muted leading-relaxed line-clamp-2">{n.message}</p>
                                                                <p className="text-[9px] text-gray-400 mt-1 font-bold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-dark-accent/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Bell className="text-gray-300" size={24} />
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-bold">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>
                                        <Link to="/profile" onClick={() => setShowNotifs(false)} className="block p-3 text-center text-[10px] font-black text-indigo-600 dark:text-dark-accent hover:bg-indigo-50 dark:hover:bg-dark-accent/10 transition-colors border-t border-indigo-50 dark:border-slate-800 uppercase tracking-widest">
                                            View Booking History
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                        {userInfo ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-xl bg-indigo-50 dark:bg-dark-accent/10 hover:bg-indigo-100 dark:hover:bg-dark-accent/20 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-dark-accent text-white flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <span className="text-sm font-semibold text-indigo-900 dark:text-dark-text-main">{userInfo.name.split(' ')[0]}</span>
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-main hover:bg-indigo-50 dark:hover:bg-dark-accent/10 hover:text-indigo-600 dark:hover:text-dark-accent"
                                        >
                                            <Settings size={16} className="mr-2" />
                                            Account Manage
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout()
                                                setShowProfileMenu(false)
                                            }}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-dark-accent border-2 border-indigo-200 dark:border-dark-accent/30 rounded-xl hover:border-indigo-400 dark:hover:border-dark-accent hover:bg-indigo-50 dark:hover:bg-dark-accent/5 transition-all duration-300">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl shadow-lg hover:shadow-indigo-400/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2.5 rounded-xl bg-indigo-50 dark:bg-dark-accent/10 hover:bg-indigo-100 dark:hover:bg-dark-accent/20 transition-all duration-200"
                    >
                        {isOpen ? (
                            <X className="w-5 h-5 text-indigo-600 dark:text-dark-accent" />
                        ) : (
                            <Menu className="w-5 h-5 text-indigo-600 dark:text-dark-accent" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl p-4 border border-indigo-100 dark:border-slate-800 shadow-xl space-y-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(to)
                                    ? 'bg-indigo-50 dark:bg-dark-accent/10 text-indigo-600 dark:text-dark-accent'
                                    : 'text-gray-600 dark:text-dark-text-muted hover:bg-gray-50 dark:hover:bg-dark-accent/5 hover:text-indigo-600 dark:hover:text-dark-accent'
                                    }`}
                            >
                                {label}
                                {isActive(to) && (
                                    <span className="ml-auto w-2 h-2 bg-indigo-500 dark:bg-dark-accent rounded-full" />
                                )}
                            </Link>
                        ))}
                        <div className="pt-3 space-y-2 border-t border-gray-100 dark:border-slate-800 mt-2">
                            {userInfo ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full block text-center px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-dark-accent border-2 border-indigo-200 dark:border-dark-accent/20 rounded-xl hover:bg-indigo-50 dark:hover:bg-dark-accent/5 transition-all">Account Manage</Link>
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full mx-auto px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900/20 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full block text-center px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-dark-accent border-2 border-indigo-200 dark:border-dark-accent/20 rounded-xl hover:bg-indigo-50 dark:hover:bg-dark-accent/5 transition-all">Sign In</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full block text-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md hover:shadow-indigo-300/50 transition-all">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
