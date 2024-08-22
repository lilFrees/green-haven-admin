import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_SUPABASE_URL": JSON.stringify(
        env.REACT_APP_SUPABASE_URL,
      ),
      "process.env.REACT_APP_SUPABASE_ANON_KEY": JSON.stringify(
        env.REACT_APP_SUPABASE_ANON_KEY,
      ),
    },
    plugins: [react()],
  };
});
