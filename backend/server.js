import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import accommodationRoutes from './routes/accommodationRoutes.js';
import foodServiceRoutes from './routes/foodServiceRoutes.js';
import transportationRoutes from './routes/transportationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import studyGroupRoutes from './routes/studyGroupRoutes.js';
import studyMaterialRoutes from './routes/studyMaterialRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import academicScheduleRoutes from './routes/academicScheduleRoutes.js';
import lectureReminderRoutes from './routes/lectureReminderRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import eventRegistrationRoutes from './routes/eventRegistrationRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import resourceBookingRoutes from './routes/resourceBookingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log('!!!!!!!!!!!!!!!! SERVER STARTING !!!!!!!!!!!!!!!!');
console.log('Current Directory:', process.cwd());

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/food-services', foodServiceRoutes);
app.use('/api/transportation', transportationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/academic-schedule', academicScheduleRoutes);
app.use('/api/lecture-reminders', lectureReminderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-registrations', eventRegistrationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/resource-bookings', resourceBookingRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('Resource and Notification routes registered');

app.get('/api/test', (req, res) => {
    res.send('Test success');
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
