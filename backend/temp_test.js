import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import { toggleBookmark } from './controllers/userController.js';

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({});
        if (!user) {
            console.log("No user found.");
            process.exit(1);
        }

        console.log("Testing toggleBookmark for User:", user._id);
        
        // Mock req/res
        const req = {
            params: { type: 'accommodation', id: '659c2356fe3cba9912b7a421' }, // Dummy ID
            user: { _id: user._id }
        };
        
        const res = {
            json: (data) => console.log("SUCCESS RESPONSE:", data),
            status: (code) => {
                console.log("STATUS CODE:", code);
                return { json: (data) => console.log("ERROR RESPONSE:", data) };
            }
        };

        await toggleBookmark(req, res);
        process.exit(0);
    } catch(err) {
        console.error("CAUGHT FATAL ERROR:");
        console.error(err);
        process.exit(1);
    }
}
run();
