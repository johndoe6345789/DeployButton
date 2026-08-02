import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 80-line files / 80-column width, project convention. Tailwind
      // className strings are exempt from the width check (ignoreStrings)
      // since a single unbroken class list can't be wrapped like code can.
      "max-lines": ["error", { max: 80, skipBlankLines: false, skipComments: false }],
      "max-len": [
        "error",
        {
          code: 80,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: false,
          ignoreUrls: true,
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "jest.setup.ts"],
    rules: {
      "max-lines": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "jest.config.ts",
  ]),
]);

export default eslintConfig;
