import mongoose from 'mongoose';

const academicScheduleSchema = new mongoose.Schema({
    moduleCode: {
        type: String,
        required: [true, 'Module code is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Lecture title is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    lecturer: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Cancelled', 'Rescheduled'],
        default: 'Scheduled'
    }
}, {
    timestamps: true
});

export default mongoose.model('AcademicSchedule', academicScheduleSchema);
