class ApiService {
    constructor() {
        this.baseURL = '/api';
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async get(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = queryString ? `${this.baseURL}${endpoint}?${queryString}` : `${this.baseURL}${endpoint}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }
        async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }


    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.headers
            });

            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async handleResponse(response) {
        const data = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                data: data,
                status: response.status
            };
        } else {
            return {
                success: false,
                error: data.message || 'Request failed',
                status: response.status
            };
        }
    }

    handleError(error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred',
            status: 0
        };
    }
}

const apiService = new ApiService();
export default apiService;