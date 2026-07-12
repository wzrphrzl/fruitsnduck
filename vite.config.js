import { defineConfig } from "vite";

export default defineConfig({
    base: '',
    build: {
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                test: 'index2.html',
            }
        }
    },
    experimental: {
        renderBuiltUrl(filename) {
            return filename;
        }
    }
});