import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Plugin to serve admin.html instead of index.html in dev mode
function adminHtmlPlugin() {
  return {
    name: 'admin-html',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Rewrite root to admin.html
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/admin.html'
        }
        next()
      })
    },
  }
}

// Admin build configuration
export default defineConfig({
  plugins: [react(), tailwindcss(), adminHtmlPlugin()],
  build: {
    outDir: 'dist/admin',
    rollupOptions: {
      input: resolve(__dirname, 'admin.html'),
    },
  },
  server: {
    port: 5174,
  },
})
