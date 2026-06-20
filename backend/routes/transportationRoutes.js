import express from 'express';
import Transportation from '../models/transportationModel.js';

const router = express.Router();

// GET all transportation routes (public)
router.get('/', async (req, res) => {
    try {
        const items = await Transportation.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single transport route (public)
router.get('/:id', async (req, res) => {
    try {
        const item = await Transportation.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create transportation (public - admin dashboard handles its own auth)
router.post('/', async (req, res) => {
    try {
        const doc = await Transportation.create(req.body);
        res.status(201).json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update transportation (public - admin dashboard handles its own auth)
router.put('/:id', async (req, res) => {
    try {
        const doc = await Transportation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE transportation (public - admin dashboard handles its own auth)
router.delete('/:id', async (req, res) => {
    try {
        const doc = await Transportation.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Transportation removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
