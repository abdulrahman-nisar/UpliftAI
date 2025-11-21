/**
 * Activity ViewModel
 * Manages activity data and operations
 */

import apiService from './ApiService.js';

class ActivityViewModel {
    constructor() {
        this.activities = [];
        this.currentActivity = null;
        this.recommendedActivities = [];
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Create activity (Admin only)
     */
    async createActivity(name, type, duration, description = '') {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.post('/activities', {
                name: name,
                type: type,
                duration: duration,
                description: description
            });

            if (response.success) {
                this.currentActivity = response.data.activity;
                return {
                    success: true,
                    activity: this.currentActivity,
                    message: 'Activity created successfully'
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
     * Get all activities
     */
    async getAllActivities() {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get('/activities');

            if (response.success) {
                this.activities = response.data.activities || [];
                return {
                    success: true,
                    activities: this.activities,
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
     * Get specific activity
     */
    async getActivity(activityId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/activities/${activityId}`);

            if (response.success) {
                this.currentActivity = response.data.activity;
                return {
                    success: true,
                    activity: this.currentActivity
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
     * Get activities by type
     */
    async getActivitiesByType(type) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/activities/type/${type}`);

            if (response.success) {
                return {
                    success: true,
                    activities: response.data.activities,
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
     * Get recommended activities based on mood and goals
     */
    async getRecommendedActivities(mood = null, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const params = {};
            if (mood) params.mood = mood;
            if (goals.length > 0) params.goals = goals;

            const response = await apiService.get('/activities/recommendations', params);

            if (response.success) {
                this.recommendedActivities = response.data.activities || [];
                return {
                    success: true,
                    activities: this.recommendedActivities,
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
     * Update activity (Admin only)
     */
    async updateActivity(activityId, updateData) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.put(`/activities/${activityId}`, updateData);

            if (response.success) {
                return {
                    success: true,
                    message: 'Activity updated successfully'
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
     * Delete activity (Admin only)
     */
    async deleteActivity(activityId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.delete(`/activities/${activityId}`);

            if (response.success) {
                // Remove from local array
                this.activities = this.activities.filter(a => a.activity_id !== activityId);
                return {
                    success: true,
                    message: 'Activity deleted successfully'
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
     * Get activities
     */
    getActivities() {
        return this.activities;
    }

    /**
     * Get recommended activities
     */
    getRecommendations() {
        return this.recommendedActivities;
    }

    /**
     * Clear activities
     */
    clearActivities() {
        this.activities = [];
        this.currentActivity = null;
        this.recommendedActivities = [];
        this.error = null;
    }
}

// Export singleton instance
const activityViewModel = new ActivityViewModel();
export default activityViewModel;