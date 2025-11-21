/**
 * User ViewModel
 * Manages user profile data and operations
 */

import apiService from './ApiService.js';

class UserViewModel {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Create user profile after Firebase Auth signup
     */
    async createUserProfile(userId, email, username, age, goals = []) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.post('/users/profile', {
                user_id: userId,
                email: email,
                username: username,
                age: age,
                goals: goals
            });

            if (response.success) {
                this.currentUser = response.data.user;
                return {
                    success: true,
                    user: this.currentUser,
                    message: 'Profile created successfully'
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
     * Get user profile
     */
    async getUserProfile(userId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/users/${userId}`);

            if (response.success) {
                this.currentUser = response.data.user;
                return {
                    success: true,
                    user: this.currentUser
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
     * Update user profile
     */
    async updateUserProfile(userId, updateData) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.put(`/users/${userId}`, updateData);

            if (response.success) {
                // Refresh user data
                await this.getUserProfile(userId);
                return {
                    success: true,
                    message: 'Profile updated successfully'
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
     * Get user goals
     */
    async getUserGoals(userId) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.get(`/users/${userId}/goals`);

            if (response.success) {
                return {
                    success: true,
                    goals: response.data.goals
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
     * Update user goals
     */
    async updateUserGoals(userId, goals) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await apiService.put(`/users/${userId}/goals`, {
                goals: goals
            });

            if (response.success) {
                return {
                    success: true,
                    message: 'Goals updated successfully'
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
     * Clear current user data
     */
    clearUser() {
        this.currentUser = null;
        this.error = null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }
}

// Export singleton instance
const userViewModel = new UserViewModel();
export default userViewModel;