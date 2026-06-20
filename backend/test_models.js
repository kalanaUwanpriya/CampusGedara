import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const listModels = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // There isn't a direct listModels in the SDK for clients usually, 
        // but we can try to hit a known model.
        
        const testModels = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
        for (const m of testModels) {
            try {
                console.log(`Testing model: ${m}`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`Success with ${m}:`, result.response.text());
                return;
            } catch (e) {
                console.log(`Failed with ${m}:`, e.message);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

listModels();
