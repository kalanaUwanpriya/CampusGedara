import mongoose from 'mongoose';

const transportationSchema = mongoose.Schema(
    {
        vehicleName: { type: String, required: true },
        startLocation: { type: String, required: true },
        endLocation: { type: String, required: true },
        startTime: { type: String, required: true },
        ticketPrice: { type: Number, required: true },
        duration: { type: String },
        capacity: { type: Number, default: 40 },
        currentPassengers: { type: Number, default: 0 },
        status: { type: String, default: 'Available' }, // Available, Full, Delayed, Cancelled
    },
    { timestamps: true }
);

const Transportation = mongoose.model('Transportation', transportationSchema);
export default Transportation;
