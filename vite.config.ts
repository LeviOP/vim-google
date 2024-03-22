import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        monkey({
            entry: "src/main.ts",
            userscript: {
                namespace: "https://github.com/LeviOP",
                match: ["*://www.google.com/search*"],
                downloadURL: "https://raw.githubusercontent.com/LeviOP/vim-google/main/dist/vim-google.user.js",
                updateURL: "https://raw.githubusercontent.com/LeviOP/vim-google/main/dist/vim-google.user.js"
            }
        })
    ]
});
