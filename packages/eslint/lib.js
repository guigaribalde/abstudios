import antfu from "@antfu/eslint-config";

export default antfu(
  {
    typescript: true,

    lessOpinionated: true,
    isInEditor: false,

    stylistic: {
      semi: true,
    },

    formatters: {
      css: true,
    },

    ignores: ["migrations/**/*", "next-env.d.ts"],
  },
  {
    rules: {
      "antfu/no-top-level-await": "off", // Allow top-level await
      "style/brace-style": ["error", "1tbs"], // Use the default brace style
      "ts/consistent-type-definitions": ["error", "type"], // Use `type` instead of `interface`
      "node/prefer-global/process": "off", // Allow using `process.env`
    },
  },
);
