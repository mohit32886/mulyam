import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { writeFileSync, renameSync, existsSync } from 'fs'

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
    // Rename admin.html to index.html after build and create _redirects
    closeBundle() {
      const distDir = resolve(__dirname, 'dist/admin')
      const adminHtml = resolve(distDir, 'admin.html')
      const indexHtml = resolve(distDir, 'index.html')

      // Rename admin.html to index.html for Cloudflare Pages
      if (existsSync(adminHtml)) {
        renameSync(adminHtml, indexHtml)
        console.log('✓ Renamed admin.html to index.html')
      }

      // Create _redirects file for SPA routing on Cloudflare Pages
      const redirectsContent = '/* /index.html 200\n'
      writeFileSync(resolve(distDir, '_redirects'), redirectsContent)
      console.log('✓ Created _redirects for Cloudflare Pages')
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
