import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        rollupOptions: {
            external: ['/path/to/external/module.es.js']
        }
    },
    plugins: [react()],
    server: {
        port: 1013
    }
});
