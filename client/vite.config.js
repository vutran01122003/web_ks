import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 1013,
        proxy: {
            '/api': {
                target: process.env.VITE_APP_API_URI,
                changeOrigin: true
            }
        }
    }
});
