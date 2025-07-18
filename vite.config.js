import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['dev.study.find-your-course.ovh'],
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,jpg,jpeg,svg,json}",
        ],
      },

      manifest: {
        name: "FocusMind",
        short_name: "FM",
        description: "Il te focus ton mind",
        theme_color: "#E00000",
        background_color: "#000000",
        display: "fullscreen",
        orientation: "portrait",
        icons: [
          {src: "/FocusMind.png", sizes: "512x512", type: "image/png"},
        ],
        screenshots: [
          {
            src:"/FocusMind.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
            label: "A",
          },
        ],
      },
    }),
  ],
});
