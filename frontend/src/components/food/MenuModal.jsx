import { useState, useContext } from 'react'
import { X, MapPin, Star, Clock, DollarSign, Phone, Mail, Trash2 } from 'lucide-react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const MenuModal = ({ restaurant, isOpen, onClose }) => {
    if (!isOpen || !restaurant) return null

    const { userInfo } = useContext(AuthContext)
    const { id, name, cuisine, type, rating, reviews, distance, image, images, email, phone, operatingHours, dietary, diningOptions, menuItems, rawReviews } = restaurant

    const [activeImage, setActiveImage] = useState(image)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [liveReviews, setLiveReviews] = useState(rawReviews || [])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const submitReview = async (e) => {
        e.preventDefault()
        if (!userInfo) return setSubmitError('You must be registered & logged in to review.')
        setIsSubmitting(true)
        setSubmitError('')
        try {
            const { data } = await axios.post(`/api/food-services/${id}/reviews`, {
                rating: reviewRating,
                comment: reviewComment,
                user: { id: userInfo._id, name: userInfo.name }
            })
            setLiveReviews(data.service.reviews)
            setReviewComment('')
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Failed to submit review')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete your review?')) return;
        try {
            const { data } = await axios.delete(`/api/food-services/${id}/reviews/${reviewId}`, {
                data: { userId: userInfo._id }
            });
            setLiveReviews(data.service.reviews);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete review');
        }
    };

    const handleWhatsAppContact = () => {
        if (!phone) return;
        // Keep only digits for the WhatsApp URL
        const cleanNumber = phone.replace(/\D/g, '');
        // Default to a common format (you might need to prepend country code if not present, 
        // but often 'wa.me' works well with local format if stored correctly)
        // If the number doesn't start with 94 (Sri Lanka), we might want to check
        const formattedNumber = cleanNumber.startsWith('94') ? cleanNumber : `94${cleanNumber.startsWith('0') ? cleanNumber.substring(1) : cleanNumber}`;
        
        window.open(`https://wa.me/${formattedNumber}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gray-200 dark:bg-dark-card w-full max-w-4xl max-h-[95vh] flex flex-col rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-300 dark:border-slate-800 no-scrollbar">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-[110] p-2 bg-white dark:bg-dark-bg rounded-full text-gray-400 hover:text-rose-600 transition-all shadow-xl border border-gray-100 dark:border-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>

                    {/* Scrollable Content Wrapper */}
                    <div className="flex-1 overflow-y-auto">

                    {/* Header Image Gallery */}
                    <div className="relative h-72 bg-slate-100 dark:bg-dark-bg">
                        <img
                            src={activeImage}
                            alt={name}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-6 text-white z-10">
                            <div className="flex items-center space-x-3 mb-2">
                                <h2 className="text-3xl font-black drop-shadow-md">{name}</h2>
                            </div>
                            <p className="text-white/90 drop-shadow-sm font-bold uppercase tracking-widest text-xs">{type}</p>
                        </div>
                        <div className="absolute top-6 right-20 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl border border-white/20 dark:border-slate-800">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <span className="text-lg font-black text-gray-900 dark:text-white">{liveReviews.length > 0 ? (liveReviews.reduce((a, c) => a + c.rating, 0) / liveReviews.length).toFixed(1) : rating}</span>
                            <span className="text-sm font-bold text-gray-500 dark:text-dark-text-muted">({liveReviews.length})</span>
                        </div>
                        
                        {/* Image Gallery Thumbnail Ribbon */}
                        {images && images.length > 1 && (
                            <div className="absolute bottom-4 right-6 flex gap-2 z-10">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImage(img)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-md ${activeImage === img ? 'border-indigo-500 scale-105 opacity-100' : 'border-white/50 opacity-80 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-10">
                        {/* Contact Information Card */}
                        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 shadow-2xl shadow-gray-300/40 dark:shadow-none border border-white dark:border-slate-800 mb-12">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-10">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="font-black text-gray-900 dark:text-dark-text-main text-lg">{phone || '0872671889'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                        <p className="font-black text-gray-900 dark:text-dark-text-main text-lg truncate">{email || 'jcafe@gmail.com'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
                                        <p className="font-black text-gray-900 dark:text-dark-text-main text-lg">{distance || 'Infront of main Building'}</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleWhatsAppContact}
                                className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-[#128C7E]/20 flex items-center justify-center gap-3"
                            >
                                <Phone className="w-5 h-5 fill-white" /> Chat on WhatsApp
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-12">
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 flex items-center gap-4 border border-indigo-100 dark:border-indigo-900/30">
                                <Clock className="w-6 h-6 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Operating Hours</p>
                                    <p className="font-black text-gray-900 dark:text-white text-lg">{operatingHours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dietary & Dining Options (Separate Columns) */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                            {/* Dietary Options */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-main mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                                    Dietary Options
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {dietary && dietary.length > 0 ? dietary.map((tag, index) => (
                                        <span
                                            key={`dietary-${index}`}
                                            className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium rounded-lg text-sm border border-green-100/50 dark:border-green-900/30"
                                        >
                                            {tag}
                                        </span>
                                    )) : <p className="text-slate-400 dark:text-dark-text-muted italic text-sm">No dietary info</p>}
                                </div>
                            </div>

                            {/* Dining Options */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text-main mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                    Dining Options
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {diningOptions && diningOptions.length > 0 ? diningOptions.map((opt, index) => (
                                        <span
                                            key={`dining-${index}`}
                                            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium rounded-lg text-sm border border-blue-100/50 dark:border-blue-900/30"
                                        >
                                            {opt}
                                        </span>
                                    )) : <p className="text-slate-400 dark:text-dark-text-muted italic text-sm">No dining info</p>}
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-rose-500 rounded-full" />
                                Flavors & Meals
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {menuItems && menuItems.length > 0 ? menuItems.map((item, index) => (
                                    <div key={index} className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-white dark:border-slate-800 flex gap-6 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300">
                                        {item.image && (
                                            <div className="shrink-0">
                                                <img src={item.image} alt={item.mealName} className="w-28 h-28 object-cover rounded-2xl shadow-md border-2 border-slate-50 dark:border-slate-700" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-gray-900 dark:text-dark-text-main text-lg">{item.mealName}</h4>
                                                <span className="font-black text-rose-500 dark:text-rose-400">Rs. {item.price}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 dark:text-dark-text-muted mb-4 line-clamp-2">{item.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.mealType === 'Vegetarian' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'}`}>
                                                    {item.mealType}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.availability === 'Available' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-dark-card text-slate-400 dark:text-dark-text-muted'}`}>
                                                    {item.availability}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-slate-400 italic">No menu items available yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Real-time Review Section */}
                        <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-12">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Guest Feedback</h3>
                            
                            {/* Submit Review */}
                            <div className="bg-white dark:bg-dark-bg border border-white dark:border-slate-800 rounded-[2rem] p-8 mb-12 shadow-sm">
                                <h4 className="text-lg font-black text-gray-900 dark:text-dark-text-main mb-6">Pen down your experience</h4>
                                <form onSubmit={submitReview}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">Your Rating</span>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                type="button" 
                                                key={star} 
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none transition-all hover:scale-125"
                                            >
                                                <Star className={`w-8 h-8 ${reviewRating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                        rows="4"
                                        placeholder="What did you love? Let others know..."
                                        className="w-full px-6 py-4 bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 outline-none mb-6 resize-none shadow-sm dark:text-dark-text-main font-bold"
                                    />
                                    {submitError && <p className="text-rose-500 text-sm font-bold mb-4 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-500" /> {submitError}</p>}
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-10 py-4 bg-rose-600 dark:bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-rose-600/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {liveReviews.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 dark:bg-dark-bg rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                        <p className="text-slate-400 dark:text-dark-text-muted italic font-bold">Be the first to share your thoughts!</p>
                                    </div>
                                ) : (
                                    liveReviews.slice().reverse().map((rev, idx) => (
                                        <div key={idx} className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-black text-slate-500 uppercase">
                                                        {rev.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 dark:text-dark-text-main leading-tight">{rev.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <div className="flex gap-1 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={star} className={`w-3.5 h-3.5 ${rev.rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                                        ))}
                                                    </div>
                                                    {userInfo?._id === rev.user && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteReview(rev._id); }}
                                                            className="text-slate-400 hover:text-rose-500 bg-white dark:bg-dark-bg p-2 rounded-xl transition-all hover:bg-rose-50 border border-slate-100 dark:border-slate-800 shadow-sm"
                                                            title="Delete my review"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 dark:text-dark-text-muted font-bold leading-relaxed ml-16">{rev.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuModal
