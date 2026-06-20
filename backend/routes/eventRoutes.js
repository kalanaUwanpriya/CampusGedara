import express from 'express';
import Event from '../models/eventModel.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST a new event
router.post('/', async (req, res) => {
    try {
        const { name, category, location, date, time, description, eligibility, organizer, image } = req.body;

        const event = new Event({
            name,
            category,
            location,
            date,
            time,
            description,
            eligibility,
            organizer,
            image
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: 'Invalid event data', error: error.message });
    }
});

// PUT update an event
router.put('/:id', async (req, res) => {
    try {
        const { name, category, location, date, time, description, eligibility, organizer, image } = req.body;

        const event = await Event.findById(req.params.id);

        if (event) {
            event.name = name || event.name;
            event.category = category || event.category;
            event.location = location || event.location;
            event.date = date || event.date;
            event.time = time || event.time;
            event.description = description || event.description;
            event.eligibility = eligibility || event.eligibility;
            event.organizer = organizer || event.organizer;
            
            if (image) {
               event.image = image;
            }

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating event' });
    }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error deleting event' });
    }
});

export default router;
