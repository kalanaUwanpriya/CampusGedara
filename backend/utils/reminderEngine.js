import ResourceBooking from '../models/resourceBookingModel.js';
import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

export const checkAndSendReminders = async () => {
    try {
        const now = new Date();
        const thirtyMinsLater = new Date(now.getTime() + 30 * 60 * 1000);
        
        const todayStr = now.toISOString().split('T')[0];
        
        // Find bookings starting today that are confirmed
        const bookings = await ResourceBooking.find({
            status: 'Confirmed',
            date: todayStr
        }).populate('resourceId', 'name');

        for (const booking of bookings) {
            if (!booking.resourceId) continue;

            const [hours, minutes] = booking.startTime.split(':');
            const startDateTime = new Date(booking.date);
            startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Check if start time is within the next 30 minutes (and not in the past)
            if (startDateTime > now && startDateTime <= thirtyMinsLater) {
                // Find user by email
                const user = await User.findOne({ email: booking.userEmail });
                if (!user) continue;

                // Check if a reminder notification already exists for this specific booking today
                const existingNotif = await Notification.findOne({
                    user: user._id,
                    message: { $regex: booking.resourceId.name },
                    createdAt: { $gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) } // Within last 2 hours
                });

                if (!existingNotif) {
                    await Notification.create({
                        user: user._id,
                        title: 'Upcoming Booking Reminder',
                        message: `Your ${booking.resourceId.name} booking starts in 30 minutes. Please arrive on time and scan your QR code to confirm check-in.`,
                        type: 'Booking Reminder',
                        link: '/profile'
                    });
                    console.log(`[Reminder Engine] Sent reminder for booking ${booking._id} to ${booking.userEmail}`);
                }
            }
        }
    } catch (error) {
        console.error('[Reminder Engine] Error:', error.message);
    }
};
