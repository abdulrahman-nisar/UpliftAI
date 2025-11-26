import apiService from './ApiService.js';

class JournalViewModel {
    constructor() {
        this.journals = [];
        this.currentJournal = null;
        this.isLoading = false;
        this.error = null;
    }

    async createJournalEntry(userId, content, prompt = '', date = null) {
        this.isLoading = true;
        this.error = null;

        try {
            const journalData = {
                user_id: userId,
                content: content,
                prompt: prompt
            };

            if (date) {
                journalData.date = date;
            }

            const response = await apiService.post('/journals', journalData);

            if (response.success) {
                this.currentJournal = response.data.journal_entry;
                return {
                    success: true,
                    journal: this.currentJournal,
                    message: 'Journal entry created successfully'
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

    async getUserJournals(userId, limit = null) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = limit ? { limit: limit } : {};
            const response = await apiService.get(`/journals/${userId}`, params);

            if (response.success) {
                this.journals = response.data.journals || [];
                return {
                    success: true,
                    journals: this.journals,
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

    async deleteJournalEntry(userId, journalId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.delete(`/journals/${userId}/${journalId}`);

            if (response.success) {
                this.journals = this.journals.filter(j => j.journal_id !== journalId);
                return {
                    success: true,
                    message: 'Journal deleted successfully'
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

const journalViewModel = new JournalViewModel();
export default journalViewModel;