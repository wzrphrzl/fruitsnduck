import { defineConfig } from "vite";

export default defineConfig({
    base: '',
    build: {
        sourcemap: true,
    },
    experimental: {
        renderBuiltUrl(filename) {
            return filename;
        }
    }
});