import ResourceBooking from '../models/resourceBookingModel.js';
import Resource from '../models/resourceModel.js';

let lastExpirationCheckAt = 0;
let expirationCheckInFlight = null;

export const checkAndExpireBookings = async () => {
    const now = new Date();
    const nowMs = now.getTime();

    if (expirationCheckInFlight) {
        return expirationCheckInFlight;
    }

    if (nowMs - lastExpirationCheckAt < 15000) {
        return;
    }

    expirationCheckInFlight = (async () => {
    try {
        // Adjust to local time if necessary, but assuming server and client use consistent time
        const todayStr = now.toISOString().split('T')[0];
        
        // Find bookings that are 'Confirmed' and potentially expired
        // This includes all past dates and today's bookings
        const bookings = await ResourceBooking.find({
            status: 'Confirmed',
            date: { $lte: todayStr }
        });

        let expiredCount = 0;

        for (const booking of bookings) {
            const [hours, minutes] = booking.startTime.split(':');
            const startDateTime = new Date(booking.date);
            startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Expiration time is 15 minutes after start time
            const expireThreshold = new Date(startDateTime.getTime() + 15 * 60 * 1000);

            if (now > expireThreshold) {
                booking.status = 'Expired';
                await booking.save();

                // Release seats
                const resource = await Resource.findById(booking.resourceId);
                if (resource) {
                    resource.availableSeats += booking.seats;
                    if (resource.availableSeats > resource.capacity) {
                        resource.availableSeats = resource.capacity;
                    }
                    await resource.save();
                }
                expiredCount++;
            }
        }

        if (expiredCount > 0) {
            console.log(`[Expiration Engine] Automatically expired ${expiredCount} bookings.`);
        }
        lastExpirationCheckAt = Date.now();
    } catch (error) {
        console.error('[Expiration Engine] Error:', error.message);
    } finally {
        expirationCheckInFlight = null;
    }
    })();

    return expirationCheckInFlight;
};
