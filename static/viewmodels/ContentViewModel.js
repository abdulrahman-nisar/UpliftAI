/**
 * Content ViewModel
 * Manages RAG content retrieval and generation
 */

import apiService from './ApiService.js';
import geminiService from '../js/GeminiService.js'

class ContentViewModel {
    constructor() {
        this.content = [];
        this.currentQuote = null;
        this.currentPrompt = null;
        this.tips = [];
        this.relevantContent = [];
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Create content (Admin only)
     */
    async createContent(text, type, category, tags = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.post('/content', {
                text: text,
                type: type,
                category: category,
                tags: tags
            });

            if (response.success) {
                return {
                    success: true,
                    content: response.data.content,
                    message: 'Content created successfully'
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get all content
     */
    async getAllContent() {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get('/content');

            if (response.success) {
                this.content = response.data.content || [];
                return {
                    success: true,
                    content: this.content,
                    count: response.data.count
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get content by category
     */
    async getContentByCategory(category) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/content/category/${category}`);

            if (response.success) {
                return {
                    success: true,
                    content: response.data.content,
                    count: response.data.count
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get content by type
     */
    async getContentByType(type) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/content/type/${type}`);

            if (response.success) {
                return {
                    success: true,
                    content: response.data.content,
                    count: response.data.count
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * RAG: Retrieve relevant content based on mood and goals
     */
    async retrieveRelevantContent(mood = null, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = {};
            if (mood) params.mood = mood;
            if (goals.length > 0) params.goals = goals.join(','); // ✅ FIX: Join array to string

            const response = await apiService.get('/content/retrieve', params);

            if (response.success) {
                this.relevantContent = response.data.content || [];
                return {
                    success: true,
                    content: this.relevantContent,
                    count: response.data.count
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Generate personalized journal prompt (Simple, no AI)
     */
    async generateJournalPrompt(mood = null, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = {};
            if (mood) params.mood = mood;
            if (goals.length > 0) params.goals = goals.join(','); // ✅ FIX: Join array

            const response = await apiService.get('/content/prompt', params);

            if (response.success) {
                this.currentPrompt = response.data.prompt;
                return {
                    success: true,
                    prompt: this.currentPrompt,
                    mood: response.data.mood
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get motivational quote
     */
    async getMotivationalQuote(category = null) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = category ? { category: category } : {};
            const response = await apiService.get('/content/quote', params);

            if (response.success) {
                this.currentQuote = response.data.quote;
                return {
                    success: true,
                    quote: this.currentQuote
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get wellness tips
     */
    async getWellnessTips(mood = null) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = mood ? { mood: mood } : {};
            const response = await apiService.get('/content/tips', params);

            if (response.success) {
                this.tips = response.data.tips || [];
                return {
                    success: true,
                    tips: this.tips
                };
            } else {
                this.error = response.error;
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (error) {
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    // ═══════════════════════════════════════════
    // RAG + AI METHODS (Using Gemini)
    // ═══════════════════════════════════════════

    /**
     * Generate journal prompt using RAG + Gemini AI
     */
    async generateRagPromptWithAI(userId, mood, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log(`🤖 Generating RAG prompt for user: ${userId}, mood: ${mood}`);
            
            // STEP 1: RETRIEVE - Get user's recent journals
            const journalsResponse = await apiService.get(`/journals/${userId}`, { limit: 2 });
            const recentJournals = [];
            
            if (journalsResponse.success && journalsResponse.data.journals) {
                journalsResponse.data.journals.forEach(j => {
                    recentJournals.push(j.content.substring(0, 80));
                });
            }
            
            console.log(`📖 Retrieved ${recentJournals.length} recent journals`);
            
            // STEP 2: RETRIEVE - Get relevant content from backend
            const params = { mood: mood };
            if (goals.length > 0) {
                params.goals = goals.join(','); // ✅ FIX: Convert array to comma-separated string
            }
            
            const contentResponse = await apiService.get('/content/retrieve', params);
            
            const retrievedTips = [];
            const retrievedQuotes = [];
            
            if (contentResponse.success && contentResponse.data.content) {
                contentResponse.data.content.forEach(item => {
                    if (item.type === 'Tip') {
                        retrievedTips.push(item.text);
                    } else if (item.type === 'Quote') {
                        retrievedQuotes.push(item.text);
                    }
                });
            }
            
            console.log(`📚 Retrieved ${retrievedTips.length} tips, ${retrievedQuotes.length} quotes`);
            
            // STEP 3: GENERATE - Use Gemini AI
            const result = await geminiService.generateJournalPrompt(
                mood,
                retrievedTips,
                retrievedQuotes,
                recentJournals
            );
            
            if (result.success) {
                this.currentPrompt = result.prompt;
                console.log('✅ AI prompt generated successfully');
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Error in generateRagPromptWithAI:', error);
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Generate motivational message with AI
     */
    async generateMotivationWithAI(mood) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log(`💬 Generating motivation for mood: ${mood}`);
            
            // Retrieve quotes
            const quotesResponse = await apiService.get('/content/type/Quote');
            
            const retrievedQuotes = [];
            if (quotesResponse.success && quotesResponse.data.content) {
                quotesResponse.data.content.forEach(q => {
                    retrievedQuotes.push(q.text);
                });
            }
            
            console.log(`📚 Retrieved ${retrievedQuotes.length} quotes`);
            
            // Generate with Gemini
            const result = await geminiService.generateMotivationalMessage(
                mood,
                retrievedQuotes
            );
            
            return result;
            
        } catch (error) {
            console.error('❌ Error in generateMotivationWithAI:', error);
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Generate daily affirmation with AI
     */
    async generateAffirmationWithAI(mood, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log(`🌟 Generating affirmation for mood: ${mood}`);
            
            const result = await geminiService.generateDailyAffirmation(mood, goals);
            
            if (result.success) {
                console.log('✅ Affirmation generated');
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Error in generateAffirmationWithAI:', error);
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Get AI feedback on journal entry
     */
    async getJournalFeedbackWithAI(journalContent, mood) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log(`💬 Generating feedback for journal entry`);
            
            const result = await geminiService.generateJournalFeedback(
                journalContent,
                mood
            );
            
            if (result.success) {
                console.log('✅ Feedback generated');
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Error in getJournalFeedbackWithAI:', error);
            this.error = error.message;
            return {
                success: false,
                error: error.message
            };
        } finally {
            this.isLoading = false;
        }
    }

    // ═══════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════

    /**
     * Get current quote
     */
    getCurrentQuote() {
        return this.currentQuote;
    }

    /**
     * Get current prompt
     */
    getCurrentPrompt() {
        return this.currentPrompt;
    }

    /**
     * Get tips
     */
    getTips() {
        return this.tips;
    }

    /**
     * Get relevant content
     */
    getRelevantContent() {
        return this.relevantContent;
    }

    /**
     * Get loading state
     */
    isLoadingState() {
        return this.isLoading;
    }

    /**
     * Get error
     */
    getError() {
        return this.error;
    }

    /**
     * Clear content
     */
    clearContent() {
        this.content = [];
        this.currentQuote = null;
        this.currentPrompt = null;
        this.tips = [];
        this.relevantContent = [];
        this.error = null;
    }

    /**
     * Clear error
     */
    clearError() {
        this.error = null;
    }
}

// Export singleton instance
const contentViewModel = new ContentViewModel();
export default contentViewModel;