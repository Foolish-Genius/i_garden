import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-syntax-highlighter')) return 'syntax-highlighter';          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react-router-dom')) return 'vendor-router';
          if (id.includes('node_modules/react-live')) return 'react-live';          if (id.includes('react') && id.includes('node_modules')) return 'vendor-react';
          if (id.includes('sanity') && id.includes('node_modules')) return 'vendor-sanity';
        }
      }
    }
  }
})