import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      '5173-ix191knre3fap7q8897fo-6553c717.manusvm.computer'
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
