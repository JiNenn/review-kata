module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "react/prop-types": "off"
  }
};
