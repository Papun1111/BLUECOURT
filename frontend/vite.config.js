import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Ensure this import is correct

export default defineConfig({
  plugins: [
    react(), // React plugin
    tailwindcss(),
     // Tailwind CSS plugin
  ],
  server:{
    port: 3000,
		proxy: {
			"/api": {
				target: "https://bluecourtbackend.onrender.com",
				changeOrigin: true,
			},
    }
  }
});
