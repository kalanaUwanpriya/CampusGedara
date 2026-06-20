import mongoose from 'mongoose';

const accommodationSchema = mongoose.Schema(
    {
        buildingName: { type: String, required: true },
        type: { type: String, required: true }, // Apartment, Dorm, Shared
        price: { type: Number, required: true },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        size: { type: Number }, // sq ft
        distance: { type: Number }, // miles from campus
        description: { type: String },
        amenities: { type: String }, // comma-separated
        contactPhone: { type: String },
        contactEmail: { type: String },
        status: { type: String, default: 'Available' }, // Available, Booked
        images: [{ type: String }],
    },
    { timestamps: true }
);

const Accommodation = mongoose.model('Accommodation', accommodationSchema);
export default Accommodation;
