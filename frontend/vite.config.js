import { defineConfig } from 'vite';

// O proxy encaminha tudo que comeca com /api para o backend Node na porta 3000.
// Assim o front chama "/api/status" e nao precisa se preocupar com CORS nem porta.
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
