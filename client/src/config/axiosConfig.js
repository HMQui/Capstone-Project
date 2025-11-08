import axios from 'axios';
import userManager from './authConfig';

const api = axios.create({
    baseURL: import.meta.env.VITE_ENVOY_URL || 'http://localhost:10000',
});

api.interceptors.request.use(
    async (config) => {
        const user = await userManager.getUser();
        if (user && user.access_token) {
            const dpopProof = await userManager.dpopProof();

            config.headers['Authorization'] = `DPoP ${user.access_token}`;
            config.headers['DPoP'] = dpopProof;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;