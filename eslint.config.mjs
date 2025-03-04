import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        rules: {
            "no-console": "warn",
            "eqeqeq": "error",
            "curly": "error",
            "quotes": ["error", "double"], 
            "semi": ["error", "always"],
            "indent": ["error", 4],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn"],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
];
