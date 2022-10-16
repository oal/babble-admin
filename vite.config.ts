import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue()
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
