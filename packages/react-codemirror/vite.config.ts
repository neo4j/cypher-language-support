import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // antlr4 build reference some node features that are not available in the browser
  plugins: [react()],
  server: { port: 3000 },
});
