import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      // Ignore heavy folders to prevent ENOSPC errors
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/.vite/**'],
      // Optional: fallback polling if ENOSPC still occurs
      usePolling: true,
      interval: 100, // only used if polling enabled
    },
  },
  base: '/colorWheel/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // @ → project root
      '@': path.resolve(__dirname, '.'),
    },
  },
  optimizeDeps: {
    include: [
      // Pre-bundle frequently used deps to speed up dev
      'react',
      'react-dom',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
