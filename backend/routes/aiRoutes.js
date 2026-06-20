import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Accommodation from '../models/accommodationModel.js';
import FoodService from '../models/foodServiceModel.js';
import Event from '../models/eventModel.js';

const router = express.Router();

router.post('/find-package', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API key is not configured in the backend environment." });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


        // Fetch Live Campus Data
        const accommodations = await Accommodation.find({ status: 'Available' }).select('buildingName type location price bedrooms size amenities -_id');
        const foods = await FoodService.find({ status: 'Active' }).select('restaurantName locationType availableMeals diningOptions operatingHours description -_id');

        // Construct System Context + Prompt
        const systemInstruction = `
You are a highly helpful and smart "Campus Assistant AI" designed specifically for a university booking system.
Your job is to recommend the best combinations of student living (accommodations) and food packages (restaurants/cafes) based on the user's budget and preferences.

Here is the CURRENT ACTIVE DATABASE of our campus accommodations:
${JSON.stringify(accommodations, null, 2)}

Here is the CURRENT ACTIVE DATABASE of our campus food services/restaurants:
${JSON.stringify(foods, null, 2)}

Instructions:
1. ONLY recommend places that actually exist in the database provided above. Do not invent names or prices.
2. If the user mentions a specific budget, calculate accurately and suggest combinations that fit within it.
3. Be friendly, concise, and format your output beautifully using Markdown (bold text, bullet points).
4. Do not expose internal JSON structures or talk about the database itself. Present the options as if you just know them natively.
5. When formatting prices or budgets, ALWAYS use "Rs." (Sri Lankan Rupees) instead of the Indian Rupee symbol "₹".

User Request: "${prompt}"
`;

        // List of models to try - prioritized 'lite' models which often have higher availability/quota
        const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
        let result;
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(systemInstruction);
                if (result) break; // Success!
            } catch (err) {
                console.error(`Model ${modelName} failed:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All models failed after trying " + modelsToTry.join(", "));
        }

        const response = await result.response;
        const replyText = response.text();

        res.json({ reply: replyText });

    } catch (error) {
        console.error("AI Error:", error);

        // Enhanced Fallback with Debug Info
        const isAuthError = error.message?.includes('API key not valid') || error.message?.includes('403');
        const isModelError = error.message?.includes('404');
        const isQuotaError = error.message?.includes('503') || error.message?.includes('429');

        if (isAuthError || isModelError || isQuotaError) {
            let debugHint = "";
            if (isAuthError) debugHint = " (Auth/API Key issue)";
            if (isModelError) debugHint = " (Model not found)";
            if (isQuotaError) debugHint = " (Quota exceeded/Service unavailable)";

            return res.json({ 
                reply: `Based on your request, I recommend looking at **Lakeside Residencies** for accommodation and the **Full Board Meal Plan** at the Main Cafeteria. This combination fits most student budgets and provides high convenience. 
                
                *(Note: The AI engine encountered an error${debugHint}. Detailed error: ${error.message}. Please check your Gemini API key and quota.)*` 
            });
        }

        res.status(500).json({ message: "Failed to generate AI response. Please try again later." });
    }
});

router.post('/recommend-events', async (req, res) => {
    try {
        const { answers } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API key is not configured in the backend environment." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const events = await Event.find({}).select('name category location date time description eligibility organizer id');

        const systemInstruction = `
You are a highly helpful and friendly "Campus Event AI Assistant".
Your job is to recommend the best events from our database based on the student's preferences.

Here is the CURRENT ACTIVE DATABASE of our campus events:
${JSON.stringify(events, null, 2)}

The student was asked 4 questions about what they are looking for today. Here are their answers:
1. What kind of vibe or mood are you looking for today?
Answer: "${answers[0] || 'Any'}"
2. What time of day works best for you?
Answer: "${answers[1] || 'Any time'}"
3. Faculty related or open to all?
Answer: "${answers[2] || 'Open to all'}"
4. Actively participate or passively enjoy?
Answer: "${answers[3] || 'Passive'}"

Instructions:
1. Select ONE or TWO highly recommended events that exist in the database above. Do not invent events.
2. Reply in a friendly, conversational tone (e.g. "I've got the perfect event for you! Check out...").
3. Explain WHY you recommended it based on their answers.
4. If there are no events that match, recommend the closest one in spirit, or apologize and suggest a generic one.
5. Format your output beautifully using Markdown. Do not mention JSON or database details.
`;

        const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
        let result;
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(systemInstruction);
                if (result) break; 
            } catch (err) {
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All models failed.");
        }

        const response = await result.response;
        const replyText = response.text();

        res.json({ reply: replyText });

    } catch (error) {
        console.error("AI Event Error:", error);
        res.status(500).json({ reply: "Sorry, I'm having trouble thinking right now. Please try again later!" });
    }
});

export default router;
