import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const test20 = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("test");
        console.log("Success with 2.0:", result.response.text());
    } catch (e) {
        console.log("Failed with 2.0:", e.message);
    }
};

test20();
