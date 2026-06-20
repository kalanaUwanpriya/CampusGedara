import express from 'express';
import { createLecture, getLectures, updateLecture, deleteLecture } from '../controllers/academicScheduleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getLectures)
    .post(protect, admin, createLecture);

router.route('/:id')
    .put(protect, admin, updateLecture)
    .delete(protect, admin, deleteLecture);

export default router;
