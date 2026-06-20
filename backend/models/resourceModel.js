import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        locationId: {
            type: String,
            required: true,
        },
        building: {
            type: String,
            required: true,
        },
        floor: {
            type: Number,
            required: true,
        },
        operatingHours: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
            default: function() {
                return this.capacity;
            },
        },
        image: {
            type: String, // Base64 string
        },
    },
    {
        timestamps: true,
    }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
