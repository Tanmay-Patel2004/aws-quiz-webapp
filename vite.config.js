import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-is", "prop-types"], // Add prop-types to external dependencies
    },
    optimizeDeps: {
      include: ["@mui/icons-material"], // Keep for MUI icons optimization
    },
  },
});
