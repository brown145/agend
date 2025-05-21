import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/components/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@convex/_generated/api",
              message:
                "Data access layer imports (Convex) are not allowed in UI components. Please move data fetching logic to a separate layer.",
            },
            {
              name: "@convex/_generated/dataModel",
              message:
                "Data access layer imports (Convex) are not allowed in UI components. Please move data fetching logic to a separate layer.",
            },
            {
              name: "convex/react",
              message:
                "Data access layer imports (Convex) are not allowed in UI components. Please move data fetching logic to a separate layer.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
