import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { apiPlugin } from "./server/api.mjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
  server: {
    allowedHosts: ["srikadali.com", "www.srikadali.com"],
  },
  preview: {
    allowedHosts: ["srikadali.com", "www.srikadali.com"],
  },
});
