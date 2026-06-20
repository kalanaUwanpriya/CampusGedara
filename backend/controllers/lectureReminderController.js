import LectureReminder from '../models/lectureReminderModel.js';
import AcademicSchedule from '../models/academicScheduleModel.js';

// @desc    Set new lecture reminder
// @route   POST /api/lecture-reminders
// @access  Private
const setReminder = async (req, res) => {
    try {
        const { lectureId, moduleCode, lectureTitle, reminderTime, academicType, reminderBefore, notes } = req.body;

        if (!reminderTime) {
            return res.status(400).json({ message: 'Reminder time is required' });
        }

        let finalModuleCode = moduleCode;
        let finalLectureTitle = lectureTitle;

        // If it's linked to an academic lecture, verify it
        if (lectureId) {
            const lecture = await AcademicSchedule.findById(lectureId);
            if (lecture) {
                finalModuleCode = lecture.moduleCode;
                finalLectureTitle = lecture.title;
            }
        }

        const reminder = await LectureReminder.create({
            lecture: lectureId || null,
            user: req.user._id,
            moduleCode: finalModuleCode,
            lectureTitle: finalLectureTitle,
            reminderTime,
            academicType: academicType || 'Assignment',
            reminderBefore,
            notes
        });

        const fullReminder = await LectureReminder.findById(reminder._id).populate('lecture');
        res.status(201).json(fullReminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReminder = async (req, res) => {
    try {
        const reminder = await LectureReminder.findById(req.params.id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        if (reminder.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updated = await LectureReminder.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('lecture');

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's lecture reminders
// @route   GET /api/lecture-reminders
// @access  Private
const getReminders = async (req, res) => {
    try {
        const reminders = await LectureReminder.find({ user: req.user._id })
            .populate('lecture')
            .sort({ createdAt: -1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lecture reminder
// @route   DELETE /api/lecture-reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
    try {
        const reminder = await LectureReminder.findById(req.params.id);
        if (reminder) {
            if (reminder.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }
            await reminder.deleteOne();
            res.json({ message: 'Reminder removed' });
        } else {
            res.status(404).json({ message: 'Reminder not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { setReminder, getReminders, deleteReminder, updateReminder };
