import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'path'
import { rm } from 'node:fs/promises'

const outDir = "../templates";
const assetsDir = "static/assets";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "Cleaning assets folder",
      async buildStart() {
        await rm(resolve(__dirname, outDir, assetsDir), { recursive: true, force: true });
      }
    },
  ],
  build: {
    outDir,
    assetsDir,
    emptyOutDir: false,
    // Enable minification for smaller bundles
    minify: true,
    // Disable sourcemaps in production for faster loads (enable for debugging)
    sourcemap: false,
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-math': ['nerdamer', 'better-react-mathjax'],
          'vendor-ui': ['@headlessui/react'],
        }
      }
    }
  }
})
