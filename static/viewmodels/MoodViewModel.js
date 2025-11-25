import apiService from './ApiService.js';

class MoodViewModel {
    constructor() {
        this.moods = [];
        this.currentMood = null;
        this.statistics = null;
        this.isLoading = false;
        this.error = null;
    }


    async createMoodEntry(userId, mood, energy, notes = '', date = null) {
        this.isLoading = true;
        this.error = null;

        try {
            const moodData = {
                user_id: userId,
                mood: mood,
                energy: energy,
                notes: notes
            };

            if (date) {
                moodData.date = date;
            }

            const response = await apiService.post('/moods', moodData);

            if (response.success) {
                this.currentMood = response.data.mood_entry;
                return {
                    success: true,
                    mood: this.currentMood,
                    message: 'Mood entry created successfully'
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


    async getUserMoods(userId, limit = null) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = limit ? { limit: limit } : {};
            const response = await apiService.get(`/moods/${userId}`, params);

            if (response.success) {
                this.moods = response.data.moods || [];
                return {
                    success: true,
                    moods: this.moods,
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

    async getMoodEntry(userId, entryId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/moods/${userId}/${entryId}`);

            if (response.success) {
                this.currentMood = response.data.mood_entry;
                return {
                    success: true,
                    mood: this.currentMood
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


    async updateMoodEntry(userId, entryId, updateData) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.put(`/moods/${userId}/${entryId}`, updateData);

            if (response.success) {
                return {
                    success: true,
                    message: 'Mood updated successfully'
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

    async deleteMoodEntry(userId, entryId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.delete(`/moods/${userId}/${entryId}`);

            if (response.success) {
                
                this.moods = this.moods.filter(m => m.entry_id !== entryId);
                return {
                    success: true,
                    message: 'Mood deleted successfully'
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


    async getMoodStatistics(userId, days = 7) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/moods/${userId}/stats`, { days: days });

            if (response.success) {
                this.statistics = response.data.statistics;
                return {
                    success: true,
                    statistics: this.statistics
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


    async getMoodsByDateRange(userId, startDate, endDate) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/moods/${userId}/range`, {
                start_date: startDate,
                end_date: endDate
            });

            if (response.success) {
                return {
                    success: true,
                    moods: response.data.moods,
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


    getAllMoods() {
        return this.moods;
    }


    clearMoods() {
        this.moods = [];
        this.currentMood = null;
        this.statistics = null;
        this.error = null;
    }
}


const moodViewModel = new MoodViewModel();
export default moodViewModel;