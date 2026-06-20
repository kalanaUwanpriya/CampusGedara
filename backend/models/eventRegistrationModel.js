import mongoose from 'mongoose';

const eventRegistrationSchema = mongoose.Schema(
    {
        eventId: { type: String, required: true },
        eventName: { type: String, required: true },
        eventDate: { type: String, required: true },
        studentName: { type: String, required: true },
        studentEmail: { type: String, required: true },
        studentIdNumber: { type: String, required: true },
        phone: { type: String, required: true },
        userId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;
