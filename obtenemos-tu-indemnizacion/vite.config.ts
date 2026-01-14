
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Esto permite que el código use process.env.API_KEY en Vercel
    'process.env': process.env
  }
});
