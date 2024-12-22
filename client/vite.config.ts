import { defineConfig } from 'vitest/config'; // Use Vitest's defineConfig
import react from '@vitejs/plugin-react'; // Replace with your framework's plugin

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'client\vitest.setup.ts', // Path to your setup file
  },
});
