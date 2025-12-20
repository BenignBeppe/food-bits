import { globalIgnores } from "eslint/config";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

export default defineConfigWithVueTs(
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"],
    },

    globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "lib/**"]),

    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,

    {
        rules: {
            "prefer-const": "off",
            "indent": ["error", 4],
            "semi": ["error", "always"],
            "quotes": ["error", "double", {"avoidEscape": true}]
        }
    },
);
