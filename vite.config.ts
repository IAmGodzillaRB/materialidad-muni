import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path';

export default defineConfig({
    plugins: [react(), nodePolyfills(), tailwindcss()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'), // '@' apunta a src/
        },
      },
});

