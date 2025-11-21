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
        this.apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
        
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
    async generateDailyAffirmation(userMood, userGoals) {
        try {
            const goalsText = userGoals.length > 0 ? userGoals.join(', ') : 'general wellness';
            
            const promptText = `
Create a powerful first-person affirmation for someone who:
- Current mood: ${userMood}
- Goals: ${goalsText}

Requirements:
- Start with "I am..." or "I can..."
- Be empowering and positive
- Relate to their mood/goals
- Maximum 15 words

Affirmation:
`;
            
            const text = await this._callGeminiAPI(promptText);
            
            return {
                success: true,
                affirmation: text
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
     * Generate personalized response to journal entry
     */
    async generateJournalFeedback(journalContent, userMood) {
        try {
            const promptText = `
${this.systemContext}

User's mood: ${userMood}
User's journal entry: "${journalContent}"

Task: Provide a supportive, empathetic response (2-3 sentences):
- Acknowledge their feelings
- Highlight any positive aspects
- Offer gentle encouragement

Response:
`;
            
            const text = await this._callGeminiAPI(promptText);
            
            return {
                success: true,
                feedback: text
            };
            
        } catch (error) {
            console.error('❌ Gemini error:', error);
            return {
                success: false,
                error: error.message
            };
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