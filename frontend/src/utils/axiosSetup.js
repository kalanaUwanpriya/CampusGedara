import axios from 'axios';

/**
 * Configures global axios interceptors to handle authentication failures.
 * This ensures that if a token expires or is invalid (401), the user is 
 * automatically logged out and redirected to the login page.
 */
const setupAxiosInterceptors = () => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // Unauthorized - usually means token expired
                localStorage.removeItem('userInfo');
                
                // Redirect to login only if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;
