import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",

    sourcemap: false,        // 🚫 saves a LOT of memory
    cssCodeSplit: false,     // 🚫 fewer chunks = less RAM
    minify: "esbuild",       // ✅ lighter than terser

    rollupOptions: {
      output: {
        manualChunks: undefined, // 🚫 disable chunk splitting
      },
    },
  }
}));
