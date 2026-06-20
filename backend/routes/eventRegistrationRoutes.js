import express from 'express';
import EventRegistration from '../models/eventRegistrationModel.js';

const router = express.Router();

// GET all registrations
router.get('/', async (req, res) => {
    try {
        const registrations = await EventRegistration.find({}).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST a new registration
router.post('/', async (req, res) => {
    try {
        const { eventId, eventName, eventDate, studentName, studentEmail, studentIdNumber, phone, userId } = req.body;

        const registration = new EventRegistration({
            eventId,
            eventName,
            eventDate,
            studentName,
            studentEmail,
            studentIdNumber,
            phone,
            userId
        });

        const createdRegistration = await registration.save();
        res.status(201).json(createdRegistration);
    } catch (error) {
        res.status(400).json({ message: 'Invalid registration data', error: error.message });
    }
});

// DELETE a registration
router.delete('/:id', async (req, res) => {
    try {
        const registration = await EventRegistration.findById(req.params.id);

        if (registration) {
            await registration.deleteOne();
            res.json({ message: 'Registration removed' });
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error deleting registration' });
    }
});

export default router;
