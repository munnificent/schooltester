import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Эта настройка позволяет получить доступ к вашему серверу разработки
    // с других устройств в той же сети (например, с телефона для тестирования).
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          ui: ['@heroui/react', '@heroui/use-theme', 'lucide-react'],
        },
      },
    },
  },
});