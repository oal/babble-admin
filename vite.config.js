import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        vue(),
    ],
    server: {
        cors: false,
        proxy: {
            '/api': {
                target: 'http://[::1]:8000',
                changeOrigin: false
            },
            '/uploads': 'http://[::1]:8000'
        }
    }
})
