import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { copyFileSync } from 'fs'

// Plugin to copy index.html to 404.html for GitHub Pages SPA routing
const copy404Plugin = () => ({
  name: 'copy-404',
  closeBundle() {
    const outDir = 'docs'
    try {
      copyFileSync(
        path.resolve(outDir, 'index.html'),
        path.resolve(outDir, '404.html')
      )
      console.log('✓ Copied index.html to 404.html for GitHub Pages')
    } catch (error) {
      console.warn('Could not copy index.html to 404.html:', error)
    }
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Awebsite/' : '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    copy404Plugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['hls.js'],
    exclude: ['motion', 'framer-motion', 'motion-dom'],
  },
  ssr: {
    noExternal: ['motion', 'framer-motion', 'motion-dom'],
  },
}))
