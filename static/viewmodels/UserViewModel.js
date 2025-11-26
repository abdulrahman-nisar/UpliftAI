import apiService from './ApiService.js';

class UserViewModel {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.error = null;
    }

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
}

const userViewModel = new UserViewModel();
export default userViewModel;