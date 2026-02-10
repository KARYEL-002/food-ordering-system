import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/chart.js')) return 'vendor-charts';
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) return 'vendor-icons';
          if (id.includes('node_modules/react-hot-toast')) return 'vendor-toast';
        }
      }
    },
    chunkSizeWarningLimit: 600, // Increase limit to reduce warnings
  }
})
