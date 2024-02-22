import { fileURLToPath, URL } from "node:url";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
/*import VitePWA from 'vite-plugin-pwa';*/

// https://vitejs.dev/config/
export default defineConfig({
  base: "/PWA/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host : "127.0.0.1"
  },
  plugins: [
    react(),
    /*VitePWA({
      manifest: {
        name: 'Votre PWA',
        short_name: 'PWA',
        description: 'Ma Progressive Web App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        lang: 'fr',
      },
    }),*/
  ],
})
