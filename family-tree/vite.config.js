import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  // imagetools makes the smaller photo copies requested in src/data/photos.js (e.g. ?w=600&format=webp).
  // Originals in src/assets/photos/ are never changed.
  plugins: [react(), imagetools()],
})
