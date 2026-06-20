import express from 'express';
import {
    getResources,
    createResource,
    updateResource,
    deleteResource
} from '../controllers/resourceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getResources)
    .post(createResource);

router.route('/:id')
    .put(updateResource)
    .delete(deleteResource);

export default router;
