/**
 * Content ViewModel
 * Manages RAG content retrieval and generation
 */

import apiService from './ApiService.js';

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
            if (goals.length > 0) params.goals = goals;

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
     * Generate personalized journal prompt
     */
    async generateJournalPrompt(mood = null, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = {};
            if (mood) params.mood = mood;
            if (goals.length > 0) params.goals = goals;

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
}

// Export singleton instance
const contentViewModel = new ContentViewModel();
export default contentViewModel;