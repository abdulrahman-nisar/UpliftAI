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

    async retrieveRelevantContent(mood = null, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = {};
            if (mood) params.mood = mood;
            if (goals.length > 0) params.goals = goals.join(',');

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

}

const contentViewModel = new ContentViewModel();
export default contentViewModel;