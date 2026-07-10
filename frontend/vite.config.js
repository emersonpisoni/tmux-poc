import { defineConfig } from 'vite';

// The proxy forwards everything starting with /api to the Node backend on port 3000.
// So the frontend calls "/api/status" and doesn't have to worry about CORS or ports.
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
