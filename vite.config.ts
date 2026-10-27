import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + hash routing let the build run from any static host or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
