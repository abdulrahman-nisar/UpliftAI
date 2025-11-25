import apiService from './ApiService.js';

class ActivityViewModel {
    constructor() {
        this.activities = [];
        this.currentActivity = null;
        this.recommendedActivities = [];
        this.isLoading = false;
        this.error = null;
    }

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


    async deleteActivity(activityId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.delete(`/activities/${activityId}`);

            if (response.success) {
               
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

    async logActivity(activityData) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.post('/activities/log', activityData);

            if (response.success) {
                return {
                    success: true,
                    data: response.data
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

    async getUserActivities(userId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/activities/user/${userId}`);

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


    getActivities() {
        return this.activities;
    }


    getRecommendations() {
        return this.recommendedActivities;
    }


    clearActivities() {
        this.activities = [];
        this.currentActivity = null;
        this.recommendedActivities = [];
        this.error = null;
    }
}


const activityViewModel = new ActivityViewModel();
export default activityViewModel;