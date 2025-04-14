// .eslintrc.json

module.exports = {
  root: true,
  env: {
    browser: true,
    jquery: true,
    es2021: true,
  },
  globals: {
    _: false,
  },
  extends: [
    "airbnb-base", "plugin:vue/recommended",
  ],
  plugins: ["vue", "import"],
  rules: {
    // js规则 https://eslint.org/docs/latest/rules/
    indent: ["error", 2],
    quotes: [1, "double"],
    semi: ["error", "never"],
    "max-len": ["error", 180],
    // vue规则 https://eslint.vuejs.org/rules/
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/first-attribute-linebreak": "off",
    "vue/html-closing-bracket-newline": "off",
    "import/extensions": ["error", "always", {
      js: "never",
      vue: "never",
    }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    "no-param-reassign": [0],
    "class-methods-use-this": [0],
    "no-plusplus": [0],
    "func-names": [0],
    "no-underscore-dangle": [0],
    "no-control-regex": [0],
    "no-unused-expressions": [0],
    "global-require": [0],
    "prefer-template": [0],
    "no-restricted-syntax": [0],
    "import/order": 0,
    "linebreak-style": 0,
    "import/prefer-default-export": 0,
    "no-shadow": 0,
    "no-bitwise": 0,
    "no-useless-escape": 0,
    "consistent-return": 0,
    "no-useless-return": 0,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./jsconfig.json",
      },
    },
  },
}
