import StudyMaterial from '../models/studyMaterialModel.js';
import Rating from '../models/ratingModel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Fetch materials for a group
// @route   GET /api/study-materials
// @access  Public
const getMaterials = async (req, res) => {
    try {
        const groupId = req.query.groupId || req.params.groupId;
        const userId = req.query.userId;
        const query = groupId ? { groupId } : {};
        
        // Exclude fileData to improve performance when listing
        // Sort by averageRating descending, then by ratingCount descending, then by newest
        let materials = await StudyMaterial.find(query)
            .select('-fileData')
            .sort({ averageRating: -1, ratingCount: -1, createdAt: -1 });

        // If userId is provided, attach the current user's rating for each material
        if (userId) {
            const materialIds = materials.map(m => m._id);
            const userRatings = await Rating.find({ userId, noteId: { $in: materialIds } });
            
            materials = materials.map(material => {
                const userRating = userRatings.find(r => r.noteId.toString() === material._id.toString());
                const materialObj = material.toObject();
                materialObj.currentUserRating = userRating ? userRating.ratingValue : 0;
                return materialObj;
            });
        }

        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch a single material (including fileData)
// @route   GET /api/study-materials/material/:id
// @access  Public
const getMaterialById = async (req, res) => {
    try {
        const material = await StudyMaterial.findById(req.params.id);
        if (material) {
            res.json(material);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a study material
// @route   POST /api/study-materials
// @access  Private
const createMaterial = async (req, res) => {
    try {
        const {
            groupId,
            type,
            title,
            description,
            author,
            fileData,
            fileName,
            fileSize,
            coverImage,
            link,
            uploaderId,
        } = req.body;

        const material = new StudyMaterial({
            groupId,
            type,
            title,
            description,
            author,
            fileData,
            fileName,
            fileSize,
            coverImage,
            link,
            uploaderId,
        });

        const createdMaterial = await material.save();
        res.status(201).json(createdMaterial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a study material
// @route   PUT /api/study-materials/:id
// @access  Private
const updateMaterial = async (req, res) => {
    try {
        const material = await StudyMaterial.findById(req.params.id);

        if (material) {
            material.title = req.body.title || material.title;
            material.description = req.body.description || material.description;
            material.author = req.body.author || material.author;
            material.type = req.body.type || material.type;
            material.fileData = req.body.fileData || material.fileData;
            material.fileName = req.body.fileName || material.fileName;
            material.fileSize = req.body.fileSize || material.fileSize;
            material.coverImage = req.body.coverImage || material.coverImage;
            material.link = req.body.link || material.link;

            const updatedMaterial = await material.save();
            res.json(updatedMaterial);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a study material
// @route   DELETE /api/study-materials/:id
// @access  Private
const deleteMaterial = async (req, res) => {
    try {
        const material = await StudyMaterial.findById(req.params.id);

        if (material) {
            await StudyMaterial.deleteOne({ _id: material._id });
            res.json({ message: 'Material removed' });
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bookmark a material
// @route   POST /api/study-materials/:id/bookmark
// @access  Private
const bookmarkMaterial = async (req, res) => {
    try {
        const { userId } = req.body;
        const material = await StudyMaterial.findById(req.params.id);

        if (material) {
            const index = material.bookmarks.indexOf(userId);
            if (index === -1) {
                material.bookmarks.push(userId);
            } else {
                material.bookmarks.splice(index, 1);
            }

            const updatedMaterial = await material.save();
            res.json({
                bookmarked: material.bookmarks.includes(userId),
                bookmarkCount: material.bookmarks.length,
            });
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to material
// @route   POST /api/study-materials/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { userId, userName, text } = req.body;
        const material = await StudyMaterial.findById(req.params.id);

        if (material) {
            const comment = { userId, userName, text };
            material.comments.push(comment);
            const updatedMaterial = await material.save();
            res.status(201).json(updatedMaterial);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Rate a study material
// @route   POST /api/study-materials/:id/rate
// @access  Private
const rateMaterial = async (req, res) => {
    try {
        const { userId, ratingValue } = req.body;
        const noteId = req.params.id;

        if (!userId || !ratingValue) {
            return res.status(400).json({ message: 'User ID and rating value are required' });
        }

        const material = await StudyMaterial.findById(noteId);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Find existing rating or create new
        let rating = await Rating.findOne({ userId, noteId });

        if (rating) {
            rating.ratingValue = ratingValue;
            await rating.save();
        } else {
            rating = new Rating({
                userId,
                noteId,
                ratingValue,
            });
            await rating.save();
        }

        // Recalculate average rating and count for the material
        const allRatings = await Rating.find({ noteId });
        const ratingCount = allRatings.length;
        const averageRating = allRatings.reduce((acc, curr) => acc + curr.ratingValue, 0) / ratingCount;

        material.ratingCount = ratingCount;
        material.averageRating = Number(averageRating.toFixed(1));
        await material.save();

        res.json({
            averageRating: material.averageRating,
            ratingCount: material.ratingCount,
            currentUserRating: ratingValue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get study materials by uploader ID
// @route   GET /api/study-materials/user/:userId
// @access  Public
const getMyMaterials = async (req, res) => {
    try {
        const materials = await StudyMaterial.find({ uploaderId: req.params.userId });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Summarize study material using AI
// @route   POST /api/study-materials/:id/summarize
// @access  Public
const summarizeMaterial = async (req, res) => {
    console.log("Summarization started for ID:", req.params.id);
    try {
        const material = await StudyMaterial.findById(req.params.id);
        if (!material) {
            console.error("Material not found for ID:", req.params.id);
            return res.status(404).json({ message: 'Material not found' });
        }
        console.log("Found material:", material.title);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY missing");
            return res.status(500).json({ message: 'Gemini API key not configured' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        let prompt = `You are an academic assistant. Summarize the following study material. 
        Title: ${material.title}
        Description: ${material.description || 'N/A'}
        Type: ${material.type}
        Author/Year: ${material.author || 'N/A'}
        
        Please provide a concise but comprehensive summary intended for students. use bullet points for key topics.`;

        // List of models to try - matching aiRoutes.js for consistency with the 2.5 key
        const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
        let result;
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Summarization: Trying model ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                // If there's file data (Base64), try to use it for better summarization
                if (material.fileData && material.fileData.includes('base64,')) {
                    const base64Data = material.fileData.split(',')[1];
                    const mimeType = material.fileData.split(';')[0].split(':')[1] || "application/pdf";

                    result = await model.generateContent([
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType
                            }
                        },
                        prompt
                    ]);
                } else {
                    result = await model.generateContent(prompt);
                }

                if (result) break; // Success!
            } catch (aiError) {
                console.error(`Summarization: Model ${modelName} failed:`, aiError.message);
                lastError = aiError;
            }
        }

        if (!result) {
            throw lastError || new Error("All AI models failed to generate a summary.");
        }

        console.log("AI Generation successful");
        const response = await result.response;
        
        // Safety check for blocked content
        if (response.candidates && response.candidates[0]?.finishReason === 'SAFETY') {
            return res.json({ summary: "Summary blocked due to safety filters. This usually happens if the document contains sensitive information." });
        }

        const text = response.text();
        if (!text) throw new Error("AI returned empty response");
        
        res.json({ summary: text });
    } catch (error) {
        console.error("SUMMARIZATION_ERROR_LOG:", error);
        
        const errorMessage = error.message?.includes('SAFETY') 
            ? "Content blocked by safety filters." 
            : (error.message || "Unknown error during summarization");
            
        res.status(500).json({ message: `AI Error: ${errorMessage}. Please check your API quota or try again later.` });
    }
};

export {
    getMaterials,
    getMaterialById,
    getMyMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    bookmarkMaterial,
    addComment,
    summarizeMaterial,
    rateMaterial,
};
