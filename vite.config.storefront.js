import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Storefront build configuration
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist/storefront',
  },
})
