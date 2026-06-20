import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const emailToMakeAdmin = process.argv[2];

if (!emailToMakeAdmin) {
    console.log('Please provide an email address: node makeAdmin.js <email>');
    process.exit(1);
}

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // Use updateOne to bypass the pre-save hook (avoids bcrypt re-hash issue)
        const result = await mongoose.connection.collection('users').updateOne(
            { email: emailToMakeAdmin },
            { $set: { isAdmin: true } }
        );

        if (result.matchedCount === 0) {
            console.log(`Error: User with email ${emailToMakeAdmin} not found.`);
        } else {
            console.log(`Success: User ${emailToMakeAdmin} is now an admin!`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();
