import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/static/', // Tells Vite that assets will be served from /static/...
    build: {
        outDir: '../static', // Build output goes directly to Flask static folder
        emptyOutDir: true, // Clean the folder before building
    },
    server: {
        proxy: {
            // Forward all /api requests to the backend
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
