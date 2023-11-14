import axios from 'axios';
import { getLogged, removeLogged } from '../utils/handleLogged';

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI,
    // headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

instance.interceptors.response.use(
    async (response) => {
        return response;
    },
    (error) => {
        if ((getLogged() || error.config.url.includes("/api/page/")) && error.response.status === 401 ) {
            removeLogged();
            window.location.href = "/";
        } 
        return Promise.reject(error);
    }
);

export default instance;
