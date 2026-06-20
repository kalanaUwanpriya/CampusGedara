// ============================================================
// Gemini AI Summarization Service
// Set your API key in the .env file as VITE_GEMINI_API_KEY
// Get a free key at: https://aistudio.google.com/app/apikey
// ============================================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

/**
 * Summarize any study material using Gemini AI.
 * @param {'note'|'paper'|'document'} type - type of material
 * @param {string} title - material title
 * @param {string} content - main text content
 * @returns {Promise<{bullets: string[], keyTopics: string[], difficulty: string}>}
 */
export async function summarizeMaterial(type, title, content) {
    // Demo mode if no API key or if it's the placeholder
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return getDemoSummary(type, title)
    }

    const prompt = buildPrompt(type, title, content)

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 512,
            }
        })
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message || `Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseGeminiResponse(rawText)
}

function buildPrompt(type, title, content) {
    const typeLabel = type === 'note' ? 'study note' : type === 'paper' ? 'past exam paper' : 'academic document'
    return `You are an academic study assistant. Analyze the following ${typeLabel} titled "${title}" and provide:
1. A concise summary in exactly 4 bullet points (start each with "• ")
2. 3 key topics/concepts (on a line starting with "TOPICS:")
3. Difficulty level: Beginner / Intermediate / Advanced (on a line starting with "DIFFICULTY:")

${typeLabel.toUpperCase()} CONTENT:
${content || 'No content provided. Infer from the title only.'}

Keep each bullet point to max 15 words. Be academic and precise.`
}

function parseGeminiResponse(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

    const bullets = lines
        .filter(l => l.startsWith('•') || l.match(/^\d\./))
        .map(l => l.replace(/^[•\d.]\s*/, '').trim())
        .slice(0, 4)

    const topicsLine = lines.find(l => l.startsWith('TOPICS:')) || ''
    const keyTopics = topicsLine
        .replace('TOPICS:', '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .slice(0, 3)

    const difficultyLine = lines.find(l => l.startsWith('DIFFICULTY:')) || ''
    const difficulty = difficultyLine.replace('DIFFICULTY:', '').trim() || 'Intermediate'

    return {
        bullets: bullets.length ? bullets : ['Summary generated successfully.'],
        keyTopics: keyTopics.length ? keyTopics : ['Academic Content'],
        difficulty
    }
}

// Demo/mock response when no API key is configured
function getDemoSummary(type, title) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                bullets: [
                    `Core concepts from "${title}" cover fundamental academic principles`,
                    'Key theories and frameworks are presented with supporting evidence',
                    'Practical applications and real-world examples are highlighted',
                    'Critical analysis and conclusions drawn from primary sources'
                ],
                keyTopics: ['Core Theory', 'Practical Application', 'Critical Analysis'],
                difficulty: 'Intermediate',
                isDemo: true
            })
        }, 1200) // simulate API delay
    })
}
