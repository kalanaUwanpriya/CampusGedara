import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        description: { type: String, required: true },
        eligibility: { type: String, required: true },
        organizer: { type: String, required: true },
        image: { type: String },
        attendees: { type: Number, default: 0 },
        status: { type: String, default: 'Upcoming' }
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
