import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

const studyMaterialSchema = mongoose.Schema(
    {
        groupId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['notes', 'papers', 'videos'],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        author: {
            type: String, // Author name for notes, Year for papers, URL for videos (sometimes)
        },
        fileData: {
            type: String, // Base64
        },
        fileName: {
            type: String,
        },
        fileSize: {
            type: String,
        },
        coverImage: {
            type: String, // Base64
        },
        link: {
            type: String, // For videos
        },
        uploaderId: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
        bookmarks: [
            {
                type: String, // Array of User IDs
            },
        ],
        comments: [commentSchema],
        isTutorMaterial: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

export default StudyMaterial;
