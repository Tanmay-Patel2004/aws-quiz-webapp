import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
       external: ["react-is"], // Remove 'prop-types' from external
    },
    optimizeDeps: {
      include: ["@mui/icons-material"], // Keep for MUI icons optimization
    },
  },
});
