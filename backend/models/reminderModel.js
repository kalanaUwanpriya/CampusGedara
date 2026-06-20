import mongoose from 'mongoose';

const reminderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Assignment', 'Mid Exam', 'Final Exam', 'Presentation', 'Other'],
            default: 'Other',
        },
        deadline: {
            type: Date,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium',
        },
        reminderBefore: {
            type: String,
            required: true,
            enum: ['1 hour before', '1 day before', '2 days before', '1 week before'],
            default: '1 day before',
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
