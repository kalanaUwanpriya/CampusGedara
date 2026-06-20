import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { User, Lock, Mail, Phone, MapPin, FileText, GraduationCap, Calendar, Clock, Users, Trash2, QrCode, Download, X as CloseIcon, Sparkles } from 'lucide-react';

const ProfilePage = () => {
    // --- Profile State ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [mobileError, setMobileError] = useState('');

    const { userInfo, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- Activity State ---
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [groups, setGroups] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qrModal, setQrModal] = useState({ show: false, booking: null });


    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
            setMobile(userInfo.mobile || '');
            setAddress(userInfo.address || '');
            fetchAllData();
        }
    }, [navigate, userInfo]);

    const fetchAllData = () => {
        fetchMyBookings();
        fetchMyGroups();
        fetchMyMaterials();
        fetchMyEvents();
    };

    const fetchMyBookings = async () => {
        if (!userInfo || !userInfo.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/resource-bookings/mybookings', config);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyGroups = async () => {
        try {
            const { data } = await axios.get('/api/study-groups');
            const myGroups = data.filter(g => g.createdBy === userInfo.email || g.createdBy === userInfo.name);
            setGroups(myGroups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const fetchMyMaterials = async () => {
        try {
            const { data } = await axios.get(`/api/study-materials/user/${userInfo._id}`);
            setMaterials(data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    const fetchMyEvents = async () => {
        try {
            const { data } = await axios.get('/api/event-registrations');
            const myEvents = data.filter(e => e.studentEmail === userInfo.email || e.userId === userInfo._id);
            setJoinedEvents(myEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.delete(`/api/resource-bookings/${bookingId}`, config);
            setMessage('Booking cancelled successfully!');
            fetchMyBookings(); // Refresh bookings
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setError(error.response?.data?.message || 'Error cancelling booking');
        }
    };

    const handleViewQR = (booking) => {
        setQrModal({ show: true, booking });
    };

    const handleDownloadQR = () => {
        const svg = document.querySelector('#booking-qr svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            
            const downloadLink = document.createElement('a');
            downloadLink.download = `booking-qr-${qrModal.booking._id.slice(-6)}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const validateMobile = (val) => {
        if (!val) return "";
        if (!/^\d+$/.test(val)) return "Mobile number must contain only digits";
        if (val.length !== 10) return "Mobile number must be exactly 10 digits";
        return "";
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (mobileError) return;

        const res = await updateProfile({ _id: userInfo._id, name, email, mobile, address, password });
        if (res.success) {
            setMessage('Profile updated successfully!');
            setPassword('');
        } else {
            setError(res.message);
        }
    };

    const isUpcomingSoon = (date, startTime) => {
        try {
            const now = new Date();
            const [hours, minutes] = startTime.split(':');
            const startDateTime = new Date(date);
            startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            const diffMs = startDateTime - now;
            const diffMins = Math.round(diffMs / 60000);
            
            return diffMins > 0 && diffMins <= 30;
        } catch (e) {
            return false;
        }
    };

    const tabs = [
        { id: 'groups', label: 'Joined Groups', count: groups.length, icon: GraduationCap },
        { id: 'materials', label: 'My Documents', count: materials.length, icon: FileText },
        { id: 'events', label: 'Events Joined', count: joinedEvents.length, icon: Calendar },
        { id: 'bookings', label: 'Resource Bookings', count: bookings.filter(b => b.status !== 'Cancelled').length, icon: Clock }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg font-sans transition-colors duration-500">
            {/* Spacer for transparent navbar area */}
             <div className="h-20 w-full shrink-0"></div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-[#8ca0b3] via-[#cbdbe8] to-[#eaf2f7] dark:from-slate-900 dark:to-slate-800 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT COLUMN: PROFILE --- */}
                <div className="lg:col-span-4 bg-white dark:bg-dark-card rounded-3xl shadow-xl overflow-hidden relative border border-white/20 dark:border-slate-800 p-8 h-fit lg:sticky lg:top-28 transition-colors duration-500">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
                    
                    <div className="text-center mb-8 pt-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main">User Profile</h2>
                        <p className="text-gray-500 dark:text-dark-text-muted mt-2 text-sm">Manage your details & account</p>
                    </div>

                    {error && (
                        <div className='bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-4 mb-6 rounded-2xl'>
                            <p className='text-sm text-red-700 dark:text-red-400 font-bold'>{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className='bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-4 mb-6 rounded-2xl'>
                            <p className='text-sm text-emerald-700 dark:text-emerald-400 font-bold'>{message}</p>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 dark:text-dark-text-muted mb-1.5 ml-1 tracking-widest">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent">
                                    <User className="h-4 w-4" />
                                </div>
                                <input required value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent transition-all outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 dark:text-dark-text-muted mb-1.5 ml-1 tracking-widest">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent transition-all outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 dark:text-dark-text-muted mb-1.5 ml-1 tracking-widest">Mobile Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <input 
                                    type="tel" 
                                    value={mobile} 
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setMobile(val);
                                        setMobileError(validateMobile(val));
                                    }} 
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-dark-bg/50 border rounded-2xl font-bold text-gray-900 dark:text-dark-text-main focus:ring-2 transition-all outline-none ${
                                        mobileError ? 'border-red-400 focus:ring-red-500' : 'border-slate-100 dark:border-slate-800 focus:ring-indigo-500 dark:focus:ring-dark-accent'
                                    }`} 
                                />
                                {mobileError && (
                                    <p className="mt-1.5 ml-1 text-[11px] font-bold text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-left-2 duration-300">
                                        {mobileError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 dark:text-dark-text-muted mb-1.5 ml-1 tracking-widest">Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent transition-all outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 dark:text-dark-text-muted mb-1.5 ml-1 tracking-widest">New Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-dark-text-muted group-focus-within:text-indigo-500 dark:group-focus-within:text-dark-accent">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent transition-all outline-none placeholder:font-medium placeholder:text-gray-400 dark:placeholder:text-dark-text-muted/40" />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-indigo-600 dark:bg-dark-accent text-white font-black tracking-wide rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 dark:hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-300 mt-6 active:scale-95">
                            SAVE CHANGES
                        </button>
                    </form>
                </div>

                {/* --- RIGHT COLUMN: ACTIVITY PANEL --- */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-3 flex overflow-x-auto no-scrollbar gap-2 lg:sticky lg:top-28 z-20 transition-colors duration-500">
                        {tabs.map(tab => {
                            const active = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl shrink-0 transition-all font-bold text-sm ${active ? 'bg-slate-900 dark:bg-dark-accent text-white shadow-xl shadow-slate-200 dark:shadow-none' : 'text-slate-500 dark:text-dark-text-muted hover:bg-slate-50 dark:hover:bg-dark-bg/50'}`}>
                                    <Icon className="w-4 h-4" /> 
                                    {tab.label} 
                                    <span className={`px-2 py-0.5 rounded-lg text-xs ${active ? 'bg-white/20' : 'bg-slate-200 dark:bg-dark-bg/80 dark:text-dark-text-muted'}`}>{tab.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-slate-50/50 dark:bg-dark-card/40 rounded-[2.5rem] shadow-inner border border-slate-100 dark:border-slate-800 p-6 sm:p-10 min-h-[500px] transition-colors duration-500">
                        {activeTab === 'bookings' ? (
                            loading ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-dark-bg/50 rounded-[2rem] flex items-center justify-center animate-pulse">
                                        <Clock className="w-8 h-8 text-indigo-400 opacity-50" />
                                    </div>
                                    <p className="text-slate-400 dark:text-dark-text-muted/60 font-bold">Loading your bookings...</p>
                                </div>
                            ) : bookings.filter(b => b.status !== 'Cancelled').length > 0 ? (
                                <div className="space-y-10 pb-10">
                                    {bookings.filter(b => b.status !== 'Cancelled').map((booking) => (
                                        <div 
                                            key={booking._id} 
                                            className={`group p-6 rounded-3xl border transition-all duration-300 ${
                                                booking.status === 'Expired' 
                                                ? 'bg-slate-50/50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800 opacity-70 grayscale-[0.5]' 
                                                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-dark-bg/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1'
                                            }`}
                                        >
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                                <div className="flex flex-col gap-2.5">
                                                    <h4 className={`font-black text-xl tracking-tight ${booking.status === 'Expired' ? 'text-gray-500' : 'text-gray-900 dark:text-dark-text-main group-hover:text-indigo-600 transition-colors'}`}>
                                                        {booking.resourceId?.name || 'Resource'}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                            booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                            booking.status === 'Checked-in' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                            booking.status === 'Expired' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                                                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        }`}>
                                                            {booking.status === 'Confirmed' ? 'CONFIRMED' : booking.status === 'Checked-in' ? 'CHECKED-IN' : booking.status}
                                                        </span>
                                                        {booking.status === 'Confirmed' && isUpcomingSoon(booking.date, booking.startTime) && (
                                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse shadow-sm">
                                                                <Sparkles className="w-3.5 h-3.5" /> Upcoming Soon
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-dark-bg/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                    <Calendar className="w-4 h-4 text-indigo-500 dark:text-dark-accent" />
                                                    <span className={`text-sm font-black ${booking.status === 'Expired' ? 'text-gray-400' : 'text-slate-700 dark:text-dark-text-main'}`}>
                                                        {booking.date}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-dark-accent/10 flex items-center justify-center text-indigo-600 dark:text-dark-accent shadow-sm">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Time Slot</span>
                                                        <span className="text-sm font-bold text-slate-700 dark:text-dark-text-main">{booking.startTime} - {booking.endTime}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                                        <Users className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Seats</span>
                                                        <span className="text-sm font-bold text-slate-700 dark:text-dark-text-main">{booking.seats} Reservations</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                                                        <Phone className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact</span>
                                                        <span className="text-sm font-bold text-slate-700 dark:text-dark-text-main">{booking.contactNumber || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {booking.status !== 'Cancelled' && booking.status !== 'Expired' && (
                                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50 dark:border-slate-800">
                                                    <button 
                                                        onClick={() => handleViewQR(booking)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white text-xs font-black rounded-2xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                        View QR Ticket
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="px-6 py-3.5 bg-white dark:bg-dark-bg text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 text-xs font-black rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all uppercase tracking-widest"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState msg={`No bookings available yet.`} />
                            )
                        ) : activeTab === 'groups' ? (
                            groups.length > 0 ? (
                                <div className="space-y-10 pb-10">
                                    {groups.map(group => (
                                        <div key={group._id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-dark-bg/30 hover:shadow-md transition-all">
                                            <h4 className="font-black text-gray-900 dark:text-dark-text-main text-lg">{group.groupName}</h4>
                                            <p className="text-sm text-indigo-600 dark:text-dark-accent font-bold">{group.subjectName} ({group.subjectCode})</p>
                                            <div className="flex items-center gap-2 mt-4 text-gray-500 dark:text-dark-text-muted text-sm">
                                                <Users className="w-4 h-4" />
                                                <span>{group.members} Members</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <EmptyState msg="No joined groups yet." />
                        ) : activeTab === 'materials' ? (
                            materials.length > 0 ? (
                                <div className="space-y-10 pb-10">
                                    {materials.map(material => (
                                        <div key={material._id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-dark-bg/30 hover:shadow-md transition-all">
                                            <h4 className="font-black text-gray-900 dark:text-dark-text-main text-lg">{material.title}</h4>
                                            <p className="text-sm text-indigo-600 dark:text-dark-accent font-bold">{material.type}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <EmptyState msg="No documents found." />
                        ) : (
                            joinedEvents.length > 0 ? (
                                <div className="space-y-10 pb-10">
                                    {joinedEvents.map(event => (
                                        <div key={event._id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-dark-bg/30 hover:shadow-md transition-all">
                                            <h4 className="font-black text-gray-900 dark:text-dark-text-main text-lg">{event.eventName}</h4>
                                            <p className="text-sm text-indigo-600 dark:text-dark-accent font-bold">{event.eventDate}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <EmptyState msg="No joined events yet." />
                        )}
                    </div>
                </div>
            </div>

            {/* QR Modal */}
            {qrModal.show && qrModal.booking && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 flex flex-col items-center border dark:border-slate-800">
                        <div className="w-full flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-900 dark:text-dark-text-main">Booking Ticket</h2>
                            <button onClick={() => setQrModal({ show: false, booking: null })} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-full transition-colors">
                                <CloseIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        <div id="booking-qr" className="w-full p-6 bg-white rounded-[2rem] shadow-inner mb-6 flex items-center justify-center">
                            <QRCodeSVG 
                                value={qrModal.booking._id} 
                                size={180}
                                level="H"
                                includeMargin={true}
                                fgColor="#4f46e5"
                            />
                        </div>

                        <div className="w-full space-y-4 text-center">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-dark-text-main">{qrModal.booking.resourceId?.name || 'Resource'}</h3>
                                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-dark-accent font-bold text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{qrModal.booking.startTime} - {qrModal.booking.endTime}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-gray-700 dark:text-dark-text-main">{qrModal.booking.date}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seats</p>
                                    <p className="text-sm font-bold text-gray-700 dark:text-dark-text-main">{qrModal.booking.seats} Reserved</p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-black rounded-full uppercase tracking-widest">
                                    {qrModal.booking.status}
                                </span>
                                
                                <button 
                                    onClick={handleDownloadQR}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-50 dark:bg-dark-accent/10 text-indigo-600 dark:text-dark-accent text-xs font-black rounded-xl hover:bg-indigo-100 transition-all"
                                >
                                    <Download className="w-4 h-4" /> DOWNLOAD TICKET
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

const EmptyState = ({msg}) => (
    <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-dark-bg/50 rounded-[2rem] flex items-center justify-center">
            <span className="text-2xl opacity-50">📁</span>
        </div>
        <p className="text-slate-400 dark:text-dark-text-muted/60 font-bold">{msg}</p>
    </div>
);

export default ProfilePage;
