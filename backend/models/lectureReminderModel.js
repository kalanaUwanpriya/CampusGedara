import mongoose from 'mongoose';

const lectureReminderSchema = new mongoose.Schema({
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicSchedule',
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moduleCode: {
        type: String,
        trim: true
    },
    lectureTitle: {
        type: String,
        trim: true
    },
    reminderTime: {
        type: Date,
        required: true
    },
    academicType: {
        type: String,
        default: 'Assignment'
    },
    reminderBefore: {
        type: String,
        required: true,
        default: '1 day before'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('LectureReminder', lectureReminderSchema);
