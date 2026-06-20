import Reminder from '../models/reminderModel.js';

// @desc    Get all reminders for a user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user._id }).sort({ deadline: 1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
    const { title, type, deadline, subject, priority, reminderBefore, notes } = req.body;

    try {
        const reminder = await Reminder.create({
            user: req.user._id,
            title,
            type,
            deadline,
            subject,
            priority,
            reminderBefore,
            notes,
        });

        res.status(201).json(reminder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (reminder) {
            if (reminder.user.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized to update this reminder');
            }

            reminder.title = req.body.title || reminder.title;
            reminder.type = req.body.type || reminder.type;
            reminder.deadline = req.body.deadline || reminder.deadline;
            reminder.subject = req.body.subject || reminder.subject;
            reminder.priority = req.body.priority || reminder.priority;
            reminder.reminderBefore = req.body.reminderBefore || reminder.reminderBefore;
            reminder.notes = req.body.notes || reminder.notes;

            const updatedReminder = await reminder.save();
            res.json(updatedReminder);
        } else {
            res.status(404).json({ message: 'Reminder not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (reminder) {
            if (reminder.user.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized to delete this reminder');
            }

            await Reminder.deleteOne({ _id: req.params.id });
            res.json({ message: 'Reminder removed' });
        } else {
            res.status(404).json({ message: 'Reminder not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getReminders, createReminder, updateReminder, deleteReminder };
