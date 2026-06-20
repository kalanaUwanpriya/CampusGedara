import mongoose from 'mongoose';

const studyGroupSchema = mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        subjectName: {
            type: String,
            required: true,
        },
        subjectCode: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        semester: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        createdBy: {
            type: String,
            required: true,
        },
        members: {
            type: Number,
            default: 1,
        },
        image: {
            type: String, // Base64
        },
    },
    {
        timestamps: true,
    }
);

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export default StudyGroup;
