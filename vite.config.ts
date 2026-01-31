import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'echarts/core': fileURLToPath(new URL('./node_modules/echarts/core.js', import.meta.url)),
      'echarts/renderers': fileURLToPath(new URL('./node_modules/echarts/renderers.js', import.meta.url)),
      'echarts/charts': fileURLToPath(new URL('./node_modules/echarts/charts.js', import.meta.url)),
      'echarts/components': fileURLToPath(new URL('./node_modules/echarts/components.js', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['echarts', 'vue-echarts', 'echarts/core', 'echarts/renderers', 'echarts/charts', 'echarts/components']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Proxy para contornar CORS e direcionar para Backend Local
      '/api-token-auth': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/edital': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/discussao': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/core': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
