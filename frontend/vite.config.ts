import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: mode === "production" ? "/Dotnet-React-Order-Display-System-/react/" : "/",
    build: {
        outDir: "react",
    },
}));
