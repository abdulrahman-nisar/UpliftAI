/**
 * Gemini AI Service using Firebase AI SDK
 * Handles all AI/LLM-based content generation
 */

import { geminiModel } from './firebase-config.js';

class GeminiService {
    constructor() {
        this.model = geminiModel;
        
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
    }
    
    /**
     * Generate personalized journal prompt using RAG + Gemini
     */
    async generateJournalPrompt(userMood, retrievedTips, retrievedQuotes, recentJournals = []) {
        try {
            // Build context from retrieved content
            const tipsText = this._formatList(retrievedTips);
            const quotesText = this._formatList(retrievedQuotes);
            const journalsText = recentJournals.join(', ');
            
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
3. Reference one of the retrieved tips naturally
4. Be supportive and encouraging
5. Keep it under 100 words

Generate only the journal prompt text, nothing else.
`;
            
            // ✅ Generate with Gemini using Firebase AI SDK
            const result = await this.model.generateContent(promptText);
            const response = result.response;
            const text = response.text();
            
            return {
                success: true,
                prompt: text.trim(),
                mood: userMood,
                source: 'gemini-firebase-ai'
            };
            
        } catch (error) {
            console.error('Gemini generation error:', error);
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
2. Incorporates one of the quotes naturally
3. Ends with encouragement

Message:
`;
            
            const result = await this.model.generateContent(promptText);
            const response = result.response;
            const text = response.text();
            
            return {
                success: true,
                message: text.trim()
            };
            
        } catch (error) {
            console.error('Gemini error:', error);
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
            const goalsText = userGoals.join(', ');
            
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
            
            const result = await this.model.generateContent(promptText);
            const response = result.response;
            const text = response.text();
            
            return {
                success: true,
                affirmation: text.trim()
            };
            
        } catch (error) {
            console.error('Gemini error:', error);
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
            
            const result = await this.model.generateContent(promptText);
            const response = result.response;
            const text = response.text();
            
            return {
                success: true,
                feedback: text.trim()
            };
            
        } catch (error) {
            console.error('Gemini error:', error);
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