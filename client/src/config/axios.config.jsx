import axios from 'axios';
import { getAccessToken, removeAccessToken } from '../utils/handleCredentials';
const publicEndpoints = ['/login', '/register'];
const { VITE_APP_API_URI } = import.meta.env;

const instance = axios.create({
    baseURL: VITE_APP_API_URI + '/api',
    withCredentials: true
});

instance.interceptors.request.use(
    async function (config) {
        const isPublicRequest = publicEndpoints.some((endpoint) => config.url.includes(endpoint));

        if (!isPublicRequest) {
            const accessToken = getAccessToken();
            if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    async (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            removeAccessToken();
            if (error.config.url.includes('/api/page/')) window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default instance;
