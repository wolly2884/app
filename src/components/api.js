import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://nodestart.onrender.com';

// Create an Axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Login API call
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/Token/login', {
            nm_user: username,
            cd_pass: password,
        });

        // Validate response data
        if (!response.data.rowCount || response.data.rowCount < 1) {
            throw new Error('Invalid login credentials');
        }

        // WARNING: Comparing plaintext passwords is insecure.
        // The backend should hash passwords (e.g., using bcrypt) and compare hashes.
        if (response.data.rows[0].cd_pass !== password) {
            throw new Error('Invalid password');
        }

        return response.data; // Return the response data (e.g., { user, rowCount, rows })
    } catch (error) {
        // Handle Axios-specific errors
        if (error.response) {
            // Server responded with a status code (e.g., 400, 401)
            const errorMessage =
                error.response.data?.error ||
                error.response.data?.message ||
                `HTTP ${error.response.status}: Login failed`;
            throw new Error(errorMessage);
        } else if (error.request) {
            // No response received (e.g., network error, CORS issue)
            throw new Error('No response from server. Check network or CORS configuration.');
        } else {
            // Other errors (e.g., request setup error)
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    }
};