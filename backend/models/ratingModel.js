import mongoose from 'mongoose';

const ratingSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudyMaterial',
            required: true,
        },
        ratingValue: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

// One user can only rate one note once
ratingSchema.index({ userId: 1, noteId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
