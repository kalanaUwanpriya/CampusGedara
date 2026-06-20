import React, { useState } from 'react'
import { X, MapPin, Star, BedDouble, Bath, Maximize, Wifi, CheckCircle, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'

const AccommodationModal = ({ accommodation, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!isOpen || !accommodation) return null

    const {
        title,
        type,
        price,
        location,
        image,
        rating,
        reviews,
        amenities,
        bedrooms,
        bathrooms,
        size,
        description,
    } = accommodation

    const galleryImages = accommodation.images && accommodation.images.length > 0 
        ? accommodation.images 
        : [image];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gray-200 dark:bg-dark-card w-full max-w-4xl max-h-[95vh] flex flex-col rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-300 dark:border-slate-800 no-scrollbar">
                {/* Close Button */}
                <button
                    onClick={() => {
                        setCurrentImageIndex(0);
                        onClose();
                    }}
                    className="absolute top-5 right-5 z-[110] p-2 bg-white dark:bg-dark-bg rounded-full text-gray-400 hover:text-rose-600 transition-all shadow-xl border border-gray-100 dark:border-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto flex-1 w-full">
                    {/* Image Gallery */}
                    <div className="relative h-80 bg-gradient-to-br from-primary-100 to-secondary-100 group">
                        <img
                            src={galleryImages[currentImageIndex]}
                            alt={`${title} - image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        {galleryImages.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                {/* Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full">
                                    {galleryImages.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-4 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-sky-100 dark:border-sky-900/30">
                                        {type}
                                    </span>
                                    <div className="flex items-center text-amber-500 gap-1.5 bg-white dark:bg-dark-bg px-3 py-1.5 rounded-full border border-gray-100 dark:border-slate-800 shadow-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-xs font-black text-gray-900 dark:text-white">4.8 <span className="text-gray-400 dark:text-dark-text-muted font-bold">(124 reviews)</span></span>
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">{title}</h2>
                                <div className="flex items-center text-gray-400 dark:text-dark-text-muted gap-2 font-bold">
                                    <MapPin className="w-5 h-5 text-sky-500" />
                                    <span>{location}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-indigo-600 dark:text-dark-accent mb-1">{formatPrice(price)}</div>
                                <div className="text-sm font-bold text-slate-400 dark:text-dark-text-muted">per Month / all inclusive</div>
                            </div>
                        </div>

                        {/* Property Details Card */}
                        <div className="grid grid-cols-3 gap-8 mb-10 p-10 bg-white dark:bg-dark-bg rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-slate-800">
                            <div className="text-center">
                                <BedDouble className="w-10 h-10 text-sky-500 mx-auto mb-3" />
                                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{bedrooms}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bedrooms</p>
                            </div>
                            <div className="text-center">
                                <Bath className="w-10 h-10 text-sky-500 mx-auto mb-3" />
                                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{bathrooms}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bathrooms</p>
                            </div>
                            <div className="text-center">
                                <Maximize className="w-10 h-10 text-sky-500 mx-auto mb-3" />
                                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{size}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Size</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Description</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-4 bg-white dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-slate-800"
                                    >
                                        <CheckCircle className="w-5 h-5 text-indigo-500" />
                                        <span className="text-sm font-bold text-gray-700 dark:text-slate-300">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information Card */}
                        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 shadow-2xl shadow-gray-300/40 dark:shadow-none border border-white dark:border-slate-800">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-10">Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-10 mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="font-black text-gray-900 dark:text-dark-text-main text-lg">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                        <p className="font-black text-gray-900 dark:text-dark-text-main text-lg truncate">housing@campus.edu</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button className="w-full bg-[#007AB8] hover:bg-[#006699] text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-[#007AB8]/20 flex items-center justify-center">
                                    Schedule a Tour
                                </button>
                                <button className="w-full bg-[#B222B2] hover:bg-[#921992] text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-[#B222B2]/20 flex items-center justify-center">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccommodationModal
