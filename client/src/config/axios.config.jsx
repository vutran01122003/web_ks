import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI + '/api',
    withCredentials: true
});

instance.interceptors.response.use(
    async (response) => {
        return response;
    },
    (error) => {
        if (error.config.url.includes('/api/page/') && error.response.status === 401) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default instance;
