import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "dev.yk-loh7.online",
      ".elb.amazonaws.com",
    ],
  },
  preview: {
    allowedHosts: [
      "dev.yk-loh7.online",
      ".elb.amazonaws.com",
    ],
  },
});

