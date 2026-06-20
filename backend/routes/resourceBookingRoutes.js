import express from 'express';
import {
    createResourceBooking,
    getAllBookings,
    getMyBookings,
    cancelBooking,
    verifyBooking
} from '../controllers/resourceBookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllBookings)
    .post(protect, createResourceBooking);

router.route('/mybookings')
    .get(protect, getMyBookings);

router.route('/:id')
    .delete(protect, cancelBooking);

router.route('/verify/:id')
    .put(protect, admin, verifyBooking);

export default router;
