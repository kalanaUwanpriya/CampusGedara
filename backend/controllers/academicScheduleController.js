import AcademicSchedule from '../models/academicScheduleModel.js';

// @desc    Create new lecture schedule
// @route   POST /api/academic-schedule
// @access  Private/Admin
const createLecture = async (req, res) => {
    try {
        const { moduleCode, title, date, startTime, endTime, location, lecturer, note, status } = req.body;

        if (!moduleCode || !title || !date || !startTime || !endTime || !location) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        if (new Date(`${date}T${endTime}`) <= new Date(`${date}T${startTime}`)) {
            return res.status(400).json({ message: 'End time must be later than start time' });
        }

        const lecture = await AcademicSchedule.create({
            moduleCode, title, date, startTime, endTime, location, lecturer, note, status
        });

        res.status(201).json(lecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all lectures
// @route   GET /api/academic-schedule
// @access  Private
const getLectures = async (req, res) => {
    try {
        const lectures = await AcademicSchedule.find({}).sort({ date: 1, startTime: 1 });
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lecture
// @route   PUT /api/academic-schedule/:id
// @access  Private/Admin
const updateLecture = async (req, res) => {
    try {
        const { moduleCode, title, date, startTime, endTime, location, lecturer, note, status } = req.body;
        const lecture = await AcademicSchedule.findById(req.params.id);

        if (lecture) {
            lecture.moduleCode = moduleCode || lecture.moduleCode;
            lecture.title = title || lecture.title;
            lecture.date = date || lecture.date;
            lecture.startTime = startTime || lecture.startTime;
            lecture.endTime = endTime || lecture.endTime;
            lecture.location = location || lecture.location;
            lecture.lecturer = lecturer || lecture.lecturer;
            lecture.note = note || lecture.note;
            lecture.status = status || lecture.status;

            const updatedLecture = await lecture.save();
            res.json(updatedLecture);
        } else {
            res.status(404).json({ message: 'Lecture not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lecture
// @route   DELETE /api/academic-schedule/:id
// @access  Private/Admin
const deleteLecture = async (req, res) => {
    try {
        const lecture = await AcademicSchedule.findById(req.params.id);
        if (lecture) {
            await lecture.deleteOne();
            res.json({ message: 'Lecture removed' });
        } else {
            res.status(404).json({ message: 'Lecture not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createLecture, getLectures, updateLecture, deleteLecture };
