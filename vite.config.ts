import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  // depending on your application, base can also be "/"

  plugins: [react(), viteTsconfigPaths(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      minifyIdentifiers: true,
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      strictRequires: true,
    },
    rollupOptions: {
      treeshake: true,
    },
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
});
