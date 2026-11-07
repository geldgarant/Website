import js from "@eslint/js"
import tseslint from "typescript-eslint"
import astro from "eslint-plugin-astro"
import globals from "globals"

export default [
    { ignores: ["dist/", ".astro/", ".claude/", "node_modules/", "test-results/", "playwright-report/", ".lighthouseci/", "docs/projectkennis/"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...astro.configs.recommended,
    // eslint-plugin-jsx-a11y ondersteunt ESLint 10 nog niet; toegankelijkheid wordt getest met axe (tests/e2e)
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
    { files: ["scripts/**"], rules: { "no-console": "off" } },
]
