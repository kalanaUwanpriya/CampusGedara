import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Library, ArrowLeft, Monitor, Users, MapPin, Clock, Search, Filter, BookOpen, Activity, Lock, CheckCircle, AlertTriangle, X, LogIn, UserPlus, QrCode, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ResourcesPage = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [bookingModal, setBookingModal] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [statusModal, setStatusModal] = useState({ show: false, type: 'success', title: '', message: '', bookingId: null });

    const categories = ['All', 'Libraries', 'Study Areas', 'Computer Labs', 'Laboratory', 'Lecture Halls', 'Common Areas'];

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {
            const { data } = await axios.get('/api/resources');
            const formatted = data.map(r => ({
                id: r._id,
                name: r.name,
                category: r.category,
                image: r.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
                location: `${r.building}, Floor ${r.floor}`,
                availableSeats: r.availableSeats,
                totalSeats: r.capacity,
                occupiedSeats: r.capacity - r.availableSeats,
                status: r.availableSeats === 0 ? 'Full' : r.availableSeats < (r.capacity * 0.2) ? 'Filling Fast' : 'Available',
                icon: r.category === 'Libraries' ? <Library className="w-5 h-5" /> : r.category === 'Computer Labs' ? <Monitor className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />,
                predictions: [
                    { time: '8AM', level: 'lowest' },
                    { time: '10AM', level: 'middle' },
                    { time: '12PM', level: 'peak' },
                    { time: '2PM', level: 'peak' },
                    { time: '4PM', level: 'middle' },
                    { time: '6PM', level: 'lowest' },
                ],
                operatingHours: r.operatingHours // Ensure this is stored for validation
            }));
            setFacilities(formatted);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching resources:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();

        // Real-time updates via Socket.io
        const socket = io();

        const handleRefresh = () => {
            fetchResources();
        };

        socket.on('booking_created', handleRefresh);
        socket.on('booking_updated', handleRefresh);
        socket.on('booking_deleted', handleRefresh);

        return () => {
            socket.disconnect();
        };
    }, []);

    const filteredFacilities = facilities.filter((facility) => {
        const matchesCategory = filter === 'All' || facility.category === filter;
        const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'text-emerald-700 bg-emerald-100 border-emerald-200';
            case 'Filling Fast':
                return 'text-amber-700 bg-amber-100 border-amber-200';
            case 'Full':
                return 'text-rose-700 bg-rose-100 border-rose-200';
            default:
                return 'text-gray-700 bg-gray-100 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Available':
                return <span className="mr-1">✓</span>;
            case 'Filling Fast':
                return <Clock className="w-4 h-4 mr-1" />;
            case 'Full':
                return <span className="mr-1">⚠</span>;
            default:
                return null;
        }
    };

    const handleBookNow = (facility) => {
        setBookingModal(facility);
    };

    const closeBooking = () => {
        setBookingModal(null);
    };

    const confirmBooking = async (e) => {
        e.preventDefault();
        
        if (!userInfo) {
            setShowAuthModal(true);
            return;
        }

        const formData = new FormData(e.target);
        const bookingDate = formData.get('date');
        const startTime = formData.get('startTime');
        const endTime = formData.get('endTime');
        const seats = parseInt(formData.get('seats'), 10);
        const contactNumber = formData.get('contactNumber');
        const purpose = formData.get('purpose');

        // Contact Number Validation
        if (!contactNumber || !/^\d{10}$/.test(contactNumber)) {
            setStatusModal({ show: true, type: 'error', title: 'Invalid Contact', message: 'Please enter a valid 10-digit mobile number.' });
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const maxDate = new Date();
        maxDate.setDate(new Date().getDate() + 7);
        const maxDateStr = maxDate.toISOString().split('T')[0];

        if (bookingDate < today) {
            setStatusModal({ show: true, type: 'error', title: 'Invalid Date', message: 'Please select a future date.' });
            return;
        }

        if (bookingDate > maxDateStr) {
            setStatusModal({ show: true, type: 'error', title: 'Date Too Far', message: 'Booking is only allowed within the next 7 days.' });
            return;
        }

        const [minTime, maxTime] = (bookingModal.operatingHours || "00:00 - 23:59").split(' - ');
        if (startTime < minTime || startTime > maxTime || endTime < minTime || endTime > maxTime) {
            setStatusModal({ show: true, type: 'error', title: 'Outside Hours', message: `Selected time is outside operating hours (${minTime} - ${maxTime}).` });
            return;
        }

        if (startTime >= endTime) {
            setStatusModal({ show: true, type: 'error', title: 'Invalid Time', message: 'End time must be after start time.' });
            return;
        }

        if (seats > bookingModal.availableSeats) {
            setStatusModal({ show: true, type: 'error', title: 'Insufficient Seats', message: `Only ${bookingModal.availableSeats} seats are currently available.` });
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (!userInfo || !userInfo.token) {
                setStatusModal({ show: true, type: 'error', title: 'Session Expired', message: 'Your session has expired. Please log in again.' });
                return;
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post('/api/resource-bookings', {
                resourceId: bookingModal.id,
                userName: userInfo.name,
                userEmail: userInfo.email,
                contactNumber,
                seats,
                date: bookingDate,
                startTime,
                endTime,
                purpose
            }, config);

            setStatusModal({ 
                show: true, 
                type: 'success', 
                title: 'Booking Confirmed!', 
                message: `Your reservation for ${bookingModal.name} on ${bookingDate} is confirmed. Details: ${seats} seats from ${startTime} to ${endTime}.`,
                bookingId: data._id
            });
            closeBooking();
            
            // Refresh facilities to show updated seats in real-time
            await fetchResources();
        } catch (error) {
            console.error("Booking error:", error);
            setStatusModal({ show: true, type: 'error', title: 'Booking Failed', message: error.response?.data?.message || "Failed to confirm booking." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadQR = () => {
        const svg = document.querySelector('#status-qr svg');
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
            downloadLink.download = `booking-qr-${statusModal.bookingId.slice(-6)}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors duration-500">
            {/* Spacer for transparent navbar area to retain exactly the same look */}
            <div className="h-20 w-full shrink-0"></div>

            {/* Main Content Area with requested Gradient */}
            <div className="flex-1 bg-gradient-to-br from-[#8ca0b3] via-[#cbdbe8] to-[#eaf2f7] dark:from-slate-900 dark:to-slate-800 pb-12">
            
            {/* Header Section - converted to glassmorphism to show the page gradient */}
            <div className="bg-white/20 backdrop-blur-md dark:bg-dark-card/40 border-b border-indigo-100/50 dark:border-slate-800/50 py-12 px-4 shadow-sm transition-colors duration-500">
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 text-white dark:shadow-none">
                                    <Library className="w-8 h-8" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-dark-text-main tracking-tight">
                                    Campus Resources
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-dark-text-muted max-w-2xl text-lg">
                                Real-time facility management subsystem. Check availability, find study spaces, and book computer labs
                                or libraries instantly.
                            </p>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search facilities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent w-full sm:w-64 bg-white dark:bg-dark-card dark:text-dark-text-main"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    <Filter className="w-5 h-5 text-gray-400 dark:text-dark-text-muted mr-2" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === cat
                                    ? 'bg-indigo-600 dark:bg-dark-accent text-white shadow-md shadow-indigo-600/20'
                                    : 'bg-white dark:bg-dark-card text-gray-600 dark:text-dark-text-muted hover:bg-indigo-50 dark:hover:bg-dark-accent/10 border border-gray-200 dark:border-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFacilities.map((facility) => (
                        <div
                            key={facility.id}
                            className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col group"
                        >
                            {/* Card Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={facility.image}
                                    alt={facility.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-white/90 dark:bg-dark-card/90 ${getStatusColor(
                                            facility.status
                                        ).replace('bg-emerald-100', 'dark:bg-emerald-900/20').replace('bg-amber-100', 'dark:bg-amber-900/20').replace('bg-rose-100', 'dark:bg-rose-900/20')} shadow-sm`}
                                    >
                                        {getStatusIcon(facility.status)}
                                        {facility.status}
                                    </span>
                                </div>
                                <div className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md rounded-xl text-indigo-600 dark:text-dark-accent shadow-sm">
                                    {facility.icon}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="text-xs font-bold text-indigo-600 dark:text-dark-accent uppercase tracking-wider mb-2">
                                    {facility.category}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main mb-3">{facility.name}</h3>

                                <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-dark-text-muted flex-grow">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 dark:text-dark-text-muted/60 flex-shrink-0 mt-0.5" />
                                        <span>{facility.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400 dark:text-dark-text-muted/60 flex-shrink-0" />
                                        <span>
                                            {facility.occupiedSeats} / {facility.totalSeats} Seats Occupied
                                        </span>
                                    </div>
                                </div>

                                {/* Availability Bar indicating crowd level */}
                                <div className="w-full bg-gray-100 dark:bg-dark-bg rounded-full h-2 mb-6 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-1000 ${facility.status === 'Available'
                                                ? 'bg-emerald-500'
                                                : facility.status === 'Filling Fast'
                                                    ? 'bg-amber-500'
                                                    : 'bg-rose-500'
                                            }`}
                                        style={{ width: `${(1 - facility.availableSeats / facility.totalSeats) * 100}%` }}
                                    />
                                </div>


                                <button
                                    onClick={() => handleBookNow(facility)}
                                    disabled={facility.status === 'Full'}
                                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${facility.status === 'Full'
                                            ? 'bg-gray-100 dark:bg-dark-bg text-gray-400 dark:text-dark-text-muted cursor-not-allowed'
                                            : 'bg-indigo-50 dark:bg-dark-accent/10 text-indigo-700 dark:text-dark-accent hover:bg-indigo-600 dark:hover:bg-dark-accent hover:text-white hover:shadow-lg hover:shadow-indigo-600/20 dark:hover:shadow-none'
                                        }`}
                                >
                                    {facility.status === 'Full' ? 'Closed' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFacilities.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-slate-800">
                        <Search className="w-16 h-16 text-indigo-200 dark:text-dark-accent/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-main mb-2">No facilities found</h3>
                        <p className="text-gray-500 dark:text-dark-text-muted">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {bookingModal && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-dark-card rounded-3xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all border dark:border-slate-800">
                        <div className="relative h-32 bg-indigo-600 dark:bg-dark-accent">
                            <img
                                src={bookingModal.image}
                                alt=""
                                className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 dark:from-dark-bg/80 to-transparent" />
                            <div className="absolute bottom-4 left-6 text-white text-xl font-bold">
                                Book Resource
                            </div>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-main mb-1">{bookingModal.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-dark-text-muted mb-6 flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-indigo-400 dark:text-dark-accent" /> {bookingModal.location}
                            </p>

                            <form onSubmit={confirmBooking} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-muted mb-1">Date</label>
                                    <input
                                        name="date"
                                        type="date"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none"
                                        min={new Date().toISOString().split('T')[0]}
                                        max={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-muted mb-1">Start Time</label>
                                        <input
                                            name="startTime"
                                            type="time"
                                            required
                                            min={(bookingModal.operatingHours || "00:00 - 23:59").split(' - ')[0]}
                                            max={(bookingModal.operatingHours || "00:00 - 23:59").split(' - ')[1]}
                                            defaultValue={(bookingModal.operatingHours || "00:00 - 23:59").split(' - ')[0]}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-muted mb-1">End Time</label>
                                        <input
                                            name="endTime"
                                            type="time"
                                            required
                                            min={(bookingModal.operatingHours || "00:00 - 23:59").split(' - ')[0]}
                                            max={(bookingModal.operatingHours || "00:00 - 23:59").split(' - ')[1]}
                                            defaultValue={(bookingModal.operatingHours || "00:00 - 23:59").split(' - ')[1]}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-muted mb-1">Number of Seats</label>
                                    <div className="relative">
                                        <input
                                            name="seats"
                                            type="number"
                                            required
                                            min="1"
                                            max={bookingModal.availableSeats}
                                            defaultValue="1"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 dark:text-dark-text-muted/60">
                                            Max: {bookingModal.availableSeats}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-indigo-600 dark:text-dark-accent font-bold bg-indigo-50 dark:bg-dark-accent/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Available: {bookingModal.operatingHours || "24 Hours"}
                                </p>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-muted mb-1">Contact Number</label>
                                    <input
                                        name="contactNumber"
                                        type="tel"
                                        required
                                        placeholder="e.g. 0771234567"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none"
                                        maxLength="10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text-muted mb-1">Purpose of Booking</label>
                                    <textarea
                                        name="purpose"
                                        rows="2"
                                        placeholder="e.g. Group study, Project work..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text-main focus:ring-2 focus:ring-indigo-500 dark:focus:ring-dark-accent outline-none resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeBooking}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-dark-text-main font-bold hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 px-4 py-3 rounded-xl text-white font-bold transition-all ${
                                            isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 dark:bg-dark-accent shadow-md shadow-indigo-600/20 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-700'
                                        }`}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal (Sign In Mandatory) */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 flex flex-col items-center text-center border dark:border-slate-800">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-500/20 dark:shadow-none">
                            <Lock className="w-10 h-10" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main mb-3">Sign In Mandatory</h2>
                        <p className="text-gray-500 dark:text-dark-text-muted font-medium mb-8 leading-relaxed">
                            To access campus resources and make bookings, you need to be logged into your account.
                        </p>

                        <div className="w-full space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-indigo-600 dark:bg-dark-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 dark:shadow-none"
                            >
                                <LogIn className="w-5 h-5" /> Sign In Now
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-4 bg-white dark:bg-dark-bg text-gray-700 dark:text-dark-text-main border border-gray-100 dark:border-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-dark-card transition-all shadow-sm"
                            >
                                <UserPlus className="w-5 h-5" /> Create an Account
                            </button>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="w-full py-3 text-gray-400 dark:text-dark-text-muted font-bold text-sm hover:text-gray-600 dark:hover:text-dark-text-main transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Modal (Success/Error) */}
            {statusModal.show && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-dark-card rounded-[2.5rem] max-w-sm w-full p-8 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 flex flex-col items-center text-center border dark:border-slate-800">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl ${
                            statusModal.type === 'success' 
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/20 dark:shadow-none' 
                            : 'bg-gradient-to-br from-rose-400 to-orange-600 shadow-rose-500/20 dark:shadow-none'
                        }`}>
                            {statusModal.type === 'success' ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                        </div>
                        
                        <h2 className="text-2xl font-black text-gray-900 dark:text-dark-text-main mb-2">{statusModal.title}</h2>
                        <p className="text-gray-500 dark:text-dark-text-muted font-medium mb-6 leading-relaxed">
                            {statusModal.message}
                        </p>

                        {statusModal.type === 'success' && statusModal.bookingId && (
                            <>
                                <div className="flex justify-center mb-6">
                                    <span className="px-5 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                                        Status: CONFIRMED
                                    </span>
                                </div>
                                <div id="status-qr" className="w-full p-6 bg-slate-50 dark:bg-dark-bg rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-8 flex flex-col items-center gap-4">
                                    <QRCodeSVG 
                                        value={statusModal.bookingId} 
                                        size={160}
                                        level="H"
                                        includeMargin={true}
                                        fgColor="#4f46e5"
                                    />
                                    <div className="text-[10px] font-black text-indigo-600 dark:text-dark-accent uppercase tracking-widest flex items-center gap-2">
                                        <QrCode className="w-3 h-3" /> Booking Verification QR
                                    </div>
                                </div>

                                <button
                                    onClick={handleDownloadQR}
                                    className="w-full py-3 mb-3 bg-indigo-50 dark:bg-dark-accent/10 text-indigo-600 dark:text-dark-accent rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all"
                                >
                                    <Download className="w-4 h-4" /> Download QR Ticket
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => setStatusModal({ ...statusModal, show: false })}
                            className={`w-full py-4 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                statusModal.type === 'success' 
                                ? 'bg-indigo-600 shadow-indigo-600/20 dark:shadow-none hover:bg-indigo-700' 
                                : 'bg-rose-600 shadow-rose-600/20 dark:shadow-none hover:bg-rose-700'
                            }`}
                        >
                            <X className="w-5 h-5" /> Close
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default ResourcesPage;
