import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.REACT_APP_ACKEE_SERVER": JSON.stringify(
        env.REACT_APP_ACKEE_SERVER || process.env.REACT_APP_ACKEE_SERVER || ""
      ),
      "process.env.REACT_APP_ACKEE_DOMAIN_ID": JSON.stringify(
        env.REACT_APP_ACKEE_DOMAIN_ID || process.env.REACT_APP_ACKEE_DOMAIN_ID || ""
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
