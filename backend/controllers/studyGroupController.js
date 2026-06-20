import StudyGroup from '../models/studyGroupModel.js';

// @desc    Fetch all study groups
// @route   GET /api/study-groups
// @access  Public
const getStudyGroups = async (req, res) => {
    try {
        const studyGroups = await StudyGroup.find({});
        res.json(studyGroups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a study group
// @route   POST /api/study-groups
// @access  Private/Admin
const createStudyGroup = async (req, res) => {
    try {
        const { groupName, subjectName, subjectCode, year, semester, description, createdBy, image } = req.body;

        const studyGroup = new StudyGroup({
            groupName,
            subjectName,
            subjectCode,
            year,
            semester,
            description,
            createdBy,
            image,
        });

        const createdStudyGroup = await studyGroup.save();
        res.status(201).json(createdStudyGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a study group
// @route   PUT /api/study-groups/:id
// @access  Private/Admin
const updateStudyGroup = async (req, res) => {
    try {
        const { groupName, subjectName, subjectCode, year, semester, description, createdBy, image } = req.body;

        const studyGroup = await StudyGroup.findById(req.params.id);

        if (studyGroup) {
            studyGroup.groupName = groupName || studyGroup.groupName;
            studyGroup.subjectName = subjectName || studyGroup.subjectName;
            studyGroup.subjectCode = subjectCode || studyGroup.subjectCode;
            studyGroup.year = year || studyGroup.year;
            studyGroup.semester = semester || studyGroup.semester;
            studyGroup.description = description || studyGroup.description;
            studyGroup.createdBy = createdBy || studyGroup.createdBy;
            studyGroup.image = image || studyGroup.image;

            const updatedStudyGroup = await studyGroup.save();
            res.json(updatedStudyGroup);
        } else {
            res.status(404).json({ message: 'Study group not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a study group
// @route   DELETE /api/study-groups/:id
// @access  Private/Admin
const deleteStudyGroup = async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);

        if (studyGroup) {
            await StudyGroup.deleteOne({ _id: studyGroup._id });
            res.json({ message: 'Study group removed' });
        } else {
            res.status(404).json({ message: 'Study group not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getStudyGroups,
    createStudyGroup,
    updateStudyGroup,
    deleteStudyGroup,
};
