import express from 'express';
import Accommodation from '../models/accommodationModel.js';

const router = express.Router();

// GET all accommodations (public)
router.get('/', async (req, res) => {
    try {
        const items = await Accommodation.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single accommodation (public)
router.get('/:id', async (req, res) => {
    try {
        const item = await Accommodation.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create accommodation (public - admin dashboard handles its own auth)
router.post('/', async (req, res) => {
    try {
        const doc = await Accommodation.create(req.body);
        res.status(201).json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update accommodation (public - admin dashboard handles its own auth)
router.put('/:id', async (req, res) => {
    try {
        const doc = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE accommodation (public - admin dashboard handles its own auth)
router.delete('/:id', async (req, res) => {
    try {
        const doc = await Accommodation.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Accommodation removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
