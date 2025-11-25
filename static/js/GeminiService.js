/**
 * Gemini AI Service using Direct REST API
 * Handles all AI/LLM-based content generation
 */

// Import config for API key
import { GEMINI_API_KEY } from './config.js';

class GeminiService {
    constructor() {
        // Gemini API configuration
        this.apiKey = GEMINI_API_KEY;
        this.apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent";
        
        // System context for wellness companion
        this.systemContext = `
You are a compassionate mental wellness companion for young adults (ages 12-30).
Your role:
- Provide empathetic, supportive responses
- Generate personalized journal prompts
- Offer evidence-based wellness advice
- Be encouraging and warm
- Keep responses concise (under 150 words)
- Use simple, friendly language
`;
        
        console.log("✅ Gemini AI Service initialized");
        
        // Validate API key
        if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            console.error('❌ Gemini API key not configured! Please add it to config.js');
        }
    }
    
    /**
     * Internal method to call Gemini API
     */
    async _callGeminiAPI(promptText) {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: promptText
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                        topP: 0.95,
                        topK: 40
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract text from response
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!text) {
                throw new Error('No response text from Gemini API');
            }
            
            return text.trim();
            
        } catch (error) {
            console.error('❌ Gemini API call failed:', error);
            throw error;
        }
    }
    
    /**
     * Generate personalized journal prompt using RAG + Gemini
     */
    async generateJournalPrompt(userMood, retrievedTips, retrievedQuotes, recentJournals = []) {
        try {
            console.log(`🤖 Generating journal prompt for mood: ${userMood}`);
            
            // Build context from retrieved content
            const tipsText = this._formatList(retrievedTips);
            const quotesText = this._formatList(retrievedQuotes);
            const journalsText = recentJournals.length > 0 ? recentJournals.join(', ') : 'None';
            
            const context = `
USER MOOD: ${userMood}

RETRIEVED WELLNESS TIPS:
${tipsText}

RETRIEVED QUOTES:
${quotesText}

RECENT JOURNAL THEMES: ${journalsText}
`;
            
            // Create prompt for Gemini
            const promptText = `
${this.systemContext}

CONTEXT:
${context}

TASK:
Generate a warm, personalized journal prompt for this user.

Requirements:
1. Acknowledge their ${userMood} mood with empathy
2. Ask 2-3 thoughtful reflection questions
3. Reference one of the retrieved tips naturally (if available)
4. Be supportive and encouraging
5. Keep it under 100 words

Generate only the journal prompt text, nothing else.
`;
            
            // Call Gemini API
            const text = await this._callGeminiAPI(promptText);
            
            console.log('✅ Journal prompt generated successfully');
            
            return {
                success: true,
                prompt: text,
                mood: userMood,
                source: 'gemini-api'
            };
            
        } catch (error) {
            console.error('❌ Gemini generation error:', error);
            return this._fallbackPrompt(userMood);
        }
    }
    
    /**
     * Generate motivational message
     */
    async generateMotivationalMessage(userMood, retrievedQuotes) {
        try {
            const quotesText = this._formatList(retrievedQuotes);
            
            const promptText = `
${this.systemContext}

User is feeling: ${userMood}

Available quotes:
${quotesText}

Task: Create a short motivational message (2-3 sentences) that:
1. Acknowledges their mood
2. Incorporates one of the quotes naturally (if available)
3. Ends with encouragement

Message:
`;
            
            const text = await this._callGeminiAPI(promptText);
            
            return {
                success: true,
                message: text
            };
            
        } catch (error) {
            console.error('❌ Gemini error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Generate daily affirmation
     */
    async generateDailyAffirmation(userMood) {
        try {
            const promptText = `
${this.systemContext}

TASK:
Generate a short, powerful daily affirmation for someone feeling ${userMood}.
It should be in the first person ("I am...").
Keep it under 20 words.
Do not use quotes.
`;
            const text = await this._callGeminiAPI(promptText);
            return text;
        } catch (error) {
            console.error('❌ Affirmation generation error:', error);
            return "I am capable of handling whatever comes my way.";
        }
    }

    /**
     * Generate a motivational quote
     */
    async generateQuote(userMood) {
        try {
            const promptText = `
${this.systemContext}

TASK:
Generate a short motivational quote for someone feeling ${userMood}.
Include the author name if real, or just the quote if generic.
Keep it under 30 words.
`;
            const text = await this._callGeminiAPI(promptText);
            return text;
        } catch (error) {
            console.error('❌ Quote generation error:', error);
            return "Believe you can and you're halfway there.";
        }
    }
    
    // Helper methods
    _formatList(items) {
        if (!items || items.length === 0) return 'None';
        return items.slice(0, 3).map(item => `- ${item}`).join('\n');
    }
    
    _fallbackPrompt(mood) {
        const prompts = {
            'Anxious': "What's causing your anxiety? Write about how you're feeling and what might help you feel more calm.",
            'Happy': "What made you happy today? Capture this moment and how it made you feel!",
            'Sad': "It's okay to feel sad. What's on your mind? Write about your feelings.",
            'Stressed': "What's stressing you most right now? Let's break it down together.",
            'Tired': "What's draining your energy? What would rest and recovery look like for you?",
            'Calm': "How are you feeling calm today? What's bringing you peace?"
        };
        
        return {
            success: true,
            prompt: prompts[mood] || "How are you feeling today? What's on your mind?",
            mood: mood,
            source: 'fallback'
        };
    }
}

// Export singleton instance
const geminiService = new GeminiService();
export default geminiService;