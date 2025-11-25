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


    async generateJournalPrompt(mood = null, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = {};
            if (mood) params.mood = mood;
            if (goals.length > 0) params.goals = goals.join(','); 

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
    

    async generateMotivationWithAI(mood) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log(`💬 Generating motivation for mood: ${mood}`);
            
            const quotesResponse = await apiService.get('/content/type/Quote');
            
            const retrievedQuotes = [];
            if (quotesResponse.success && quotesResponse.data.content) {
                quotesResponse.data.content.forEach(q => {
                    retrievedQuotes.push(q.text);
                });
            }
            
            console.log(`📚 Retrieved ${retrievedQuotes.length} quotes`);
            
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


    getCurrentQuote() {
        return this.currentQuote;
    }


    getCurrentPrompt() {
        return this.currentPrompt;
    }


    getTips() {
        return this.tips;
    }


    getRelevantContent() {
        return this.relevantContent;
    }


    isLoadingState() {
        return this.isLoading;
    }


    getError() {
        return this.error;
    }

    clearContent() {
        this.content = [];
        this.currentQuote = null;
        this.currentPrompt = null;
        this.tips = [];
        this.relevantContent = [];
        this.error = null;
    }


    clearError() {
        this.error = null;
    }
}


const contentViewModel = new ContentViewModel();
export default contentViewModel;