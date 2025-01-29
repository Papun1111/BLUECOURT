import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Ensure this import is correct

export default defineConfig({
  plugins: [
    react(), // React plugin
    tailwindcss(),
     // Tailwind CSS plugin
  ]
});
