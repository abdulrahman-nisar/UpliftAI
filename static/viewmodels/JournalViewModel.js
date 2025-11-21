/**
 * Journal ViewModel
 * Manages journal entries data and operations
 */

import apiService from './ApiService.js';

class JournalViewModel {
    constructor() {
        this.journals = [];
        this.currentJournal = null;
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Create journal entry
     */
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

    /**
     * Get all user journals
     */
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

    /**
     * Get specific journal entry
     */
    async getJournalEntry(userId, journalId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/journals/${userId}/${journalId}`);

            if (response.success) {
                this.currentJournal = response.data.journal_entry;
                return {
                    success: true,
                    journal: this.currentJournal
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
     * Update journal entry
     */
    async updateJournalEntry(userId, journalId, updateData) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.put(`/journals/${userId}/${journalId}`, updateData);

            if (response.success) {
                return {
                    success: true,
                    message: 'Journal updated successfully'
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
     * Delete journal entry
     */
    async deleteJournalEntry(userId, journalId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.delete(`/journals/${userId}/${journalId}`);

            if (response.success) {
                // Remove from local array
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

    /**
     * Search journals
     */
    async searchJournals(userId, keyword) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/journals/${userId}/search`, {
                keyword: keyword
            });

            if (response.success) {
                return {
                    success: true,
                    journals: response.data.journals,
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
     * Get journals by date range
     */
    async getJournalsByDateRange(userId, startDate, endDate) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/journals/${userId}/range`, {
                start_date: startDate,
                end_date: endDate
            });

            if (response.success) {
                return {
                    success: true,
                    journals: response.data.journals,
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
     * Get all journals
     */
    getAllJournals() {
        return this.journals;
    }

    /**
     * Clear journals
     */
    clearJournals() {
        this.journals = [];
        this.currentJournal = null;
        this.error = null;
    }
}

// Export singleton instance
const journalViewModel = new JournalViewModel();
export default journalViewModel;