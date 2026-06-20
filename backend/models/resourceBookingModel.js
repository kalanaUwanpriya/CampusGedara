import mongoose from 'mongoose';

const resourceBookingSchema = mongoose.Schema(
    {
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Resource',
        },
        userName: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        seats: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        purpose: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            default: 'Confirmed',
        },
    },
    {
        timestamps: true,
    }
);

const ResourceBooking = mongoose.model('ResourceBooking', resourceBookingSchema);

export default ResourceBooking;
