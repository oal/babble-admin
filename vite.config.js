import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue2'
import {VuetifyResolver} from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
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
        Components({
            resolvers: [
                VuetifyResolver(),
            ],
        }),
    ],
    server: {
        cors: false,
        proxy: {
            '/api': 'http://localhost:8000',
            '/uploads': 'http://localhost:8000'
        }
    }
})
