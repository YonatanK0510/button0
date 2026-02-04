import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "k8s-button0-button0f-e1297085bf-1621650183.eu-central-1.elb.amazonaws.com",
    ],
  },
});

