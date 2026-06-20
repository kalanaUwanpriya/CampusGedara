import express from 'express';
import { setReminder, getReminders, deleteReminder, updateReminder } from '../controllers/lectureReminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getReminders)
    .post(protect, setReminder);

router.route('/:id')
    .put(protect, updateReminder)
    .delete(protect, deleteReminder);

export default router;
