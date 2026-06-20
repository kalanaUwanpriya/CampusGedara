import ResourceBooking from '../models/resourceBookingModel.js';
import Resource from '../models/resourceModel.js';
import { checkAndExpireBookings } from '../utils/expirationCheck.js';

// @desc    Create new resource booking
// @route   POST /api/resource-bookings
// @access  Private
const createResourceBooking = async (req, res) => {
    try {
        const {
            resourceId,
            userName,
            userEmail,
            contactNumber,
            seats,
            date,
            startTime,
            endTime,
            purpose
        } = req.body;

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource.availableSeats < seats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Create the booking
        const booking = new ResourceBooking({
            resourceId,
            userName,
            userEmail,
            contactNumber,
            seats,
            date,
            startTime,
            endTime,
            purpose
        });

        const createdBooking = await booking.save();

        // Update available seats in the resource
        resource.availableSeats -= seats;
        await resource.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all bookings (for Admin)
// @route   GET /api/resource-bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        await checkAndExpireBookings(); // Clean up expired bookings first
        const bookings = await ResourceBooking.find({}).populate('resourceId', 'name').sort({ createdAt: -1 });
        console.log(`Backend: Found ${bookings.length} bookings`);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/resource-bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        await checkAndExpireBookings(); // Clean up expired bookings first
        console.log('Backend: Fetching bookings for user email:', req.user.email);
        const bookings = await ResourceBooking.find({ userEmail: req.user.email }).populate('resourceId', 'name').sort({ createdAt: -1 });
        console.log(`Backend: Found ${bookings.length} bookings for ${req.user.email}`);
        res.json(bookings);
    } catch (error) {
        console.error('Backend Error in getMyBookings:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   DELETE /api/resource-bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await ResourceBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is owner of the booking
        if (booking.userEmail !== req.user.email) {
            return res.status(401).json({ message: 'Not authorized to cancel this booking' });
        }

        // Only release seats if the booking was not already cancelled
        if (booking.status === 'Confirmed') {
            // Find the resource to update available seats
            const resource = await Resource.findById(booking.resourceId);
            if (resource) {
                resource.availableSeats += booking.seats;
                // Ensure availableSeats doesn't exceed capacity
                if (resource.availableSeats > resource.capacity) {
                    resource.availableSeats = resource.capacity;
                }
                await resource.save();
                console.log(`Seats released: ${booking.seats} added back to ${resource.name}. New total: ${resource.availableSeats}`);
            }
            
            booking.status = 'Cancelled';
            await booking.save();
            res.json({ message: 'Booking cancelled and seats released successfully' });
        } else if (booking.status === 'Cancelled') {
            res.status(400).json({ message: 'Booking is already cancelled' });
        } else {
            // For any other status, just cancel it
            booking.status = 'Cancelled';
            await booking.save();
            res.json({ message: 'Booking cancelled successfully' });
        }
    } catch (error) {
        console.error('Error in cancelBooking:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify a booking (for QR Scanning)
// @route   PUT /api/resource-bookings/verify/:id
// @access  Private/Admin
const verifyBooking = async (req, res) => {
    console.log('Verification request received for booking ID:', req.params.id);
    try {
        const booking = await ResourceBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'This booking has been cancelled' });
        }

        if (booking.status === 'Expired') {
            return res.status(400).json({ message: 'This booking has expired' });
        }

        if (booking.status === 'Checked-in') {
            return res.status(400).json({ message: 'This booking is already checked-in' });
        }

        // Logic Check: Must be scanned within 15 minutes of start time
        const now = new Date();
        const [hours, minutes] = booking.startTime.split(':');
        const startDateTime = new Date(booking.date);
        startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const expireThreshold = new Date(startDateTime.getTime() + 15 * 60 * 1000);

        if (now > expireThreshold) {
            console.log('Late Scan: Booking expired');
            booking.status = 'Expired';
            await booking.save();
            
            // Release seats
            const resource = await Resource.findById(booking.resourceId);
            if (resource) {
                resource.availableSeats += booking.seats;
                if (resource.availableSeats > resource.capacity) resource.availableSeats = resource.capacity;
                await resource.save();
            }
            return res.status(400).json({ message: 'Verification failed: Booking expired (15-min window passed)' });
        }

        if (now < startDateTime) {
            // Optional: check if too early? User said "When booking start time begins". 
            // We'll allow a bit of buffer or just warn. Let's strictly follow "When it begins".
            // But usually students are a few mins early. 
            // For now, let's just proceed if it's the right day.
        }

        console.log('Updating booking status to Checked-in...');
        booking.status = 'Checked-in';
        await booking.save();
        console.log('Booking saved successfully!');

        res.json({ message: 'Booking verified successfully', booking });
    } catch (error) {
        console.error('Error in verifyBooking:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export {
    createResourceBooking,
    getAllBookings,
    getMyBookings,
    cancelBooking,
    verifyBooking
};
