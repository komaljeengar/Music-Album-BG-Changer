import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // Ensure the output directory is correct for Vercel to find
  },
  plugins: [react()],
});

