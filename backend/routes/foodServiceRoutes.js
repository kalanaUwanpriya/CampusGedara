import express from 'express';
import FoodService from '../models/foodServiceModel.js';

const router = express.Router();

// GET all food services (public)
router.get('/', async (req, res) => {
    try {
        const items = await FoodService.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single food service (public)
router.get('/:id', async (req, res) => {
    try {
        const item = await FoodService.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a review to food service (public)
router.post('/:id/reviews', async (req, res) => {
    try {
        const { rating, comment, user } = req.body;
        const service = await FoodService.findById(req.params.id);

        if (service) {
            // Check if user already reviewed
            const alreadyReviewed = service.reviews.find(
                (r) => r.user && r.user.toString() === user.id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'You already reviewed this service' });
            }

            const review = {
                name: user.name,
                rating: Number(rating),
                comment,
                user: user.id
            };

            service.reviews.push(review);
            service.numReviews = service.reviews.length;
            service.rating = service.reviews.reduce((acc, item) => item.rating + acc, 0) / service.reviews.length;

            await service.save();
            res.status(201).json({ message: 'Review added', service });
        } else {
            res.status(404).json({ message: 'Food service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a review (public)
router.delete('/:id/reviews/:reviewId', async (req, res) => {
    try {
        const { userId } = req.body;
        const service = await FoodService.findById(req.params.id);

        if (service) {
            const reviewIndex = service.reviews.findIndex(r => r._id.toString() === req.params.reviewId);
            
            if (reviewIndex === -1) {
                return res.status(404).json({ message: 'Review not found' });
            }

            if (service.reviews[reviewIndex].user.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'User not authorized to delete this review' });
            }

            service.reviews.splice(reviewIndex, 1);
            service.numReviews = service.reviews.length;
            service.rating = service.reviews.length > 0 
                ? service.reviews.reduce((acc, item) => item.rating + acc, 0) / service.reviews.length 
                : 0;

            await service.save();
            res.json({ message: 'Review removed', service });
        } else {
            res.status(404).json({ message: 'Food service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create food service (public - admin dashboard handles its own auth)
router.post('/', async (req, res) => {
    try {
        const doc = await FoodService.create(req.body);
        res.status(201).json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update food service (public - admin dashboard handles its own auth)
router.put('/:id', async (req, res) => {
    try {
        const doc = await FoodService.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE food service (public - admin dashboard handles its own auth)
router.delete('/:id', async (req, res) => {
    try {
        const doc = await FoodService.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Food service removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
