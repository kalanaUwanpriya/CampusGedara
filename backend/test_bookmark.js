import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function runTest() {
    try {
        console.log("Connecting to mongo to get a user...");
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection;
        
        // Find any user
        const User = db.collection('users');
        const Accommodation = db.collection('accommodations');
        
        const user = await User.findOne({});
        if (!user) {
            console.log("No users found.");
            process.exit(1);
        }
        
        const acc = await Accommodation.findOne({});
        if (!acc) {
            console.log("No accommodations found.");
            process.exit(1);
        }
        
        console.log("Found user:", user.email, "and acc:", acc._id);
        
        // Log in to get token
        const loginRes = await axios.post('http://localhost:5000/api/users/login', {
            email: user.email,
            password: 'password123' // hope this is standard or we bypass
        }).catch(e => {
            console.log("Login failed directly. Lets just use token gen manually if we could.");
        });
        
        // Alternatively we can just read the userController directly or observe the logic
        process.exit(0);

    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
runTest();
