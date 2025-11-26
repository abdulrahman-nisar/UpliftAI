import apiService from './ApiService.js';

class ActivityViewModel {
    constructor() {
        this.activities = [];
        this.currentActivity = null;
        this.recommendedActivities = [];
        this.isLoading = false;
        this.error = null;
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
}

const activityViewModel = new ActivityViewModel();
export default activityViewModel;