module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 0,
    'object-curly-spacing': [0, 'never'],
    'eol-last': 0,
    "no-trailing-spaces": 1,
    "import/no-duplicates":0,
    "no-multiple-empty-lines": [1, {"max": 2}],
    "spaced-comment": 0,
    "space-before-function-paren": [0, "always"],
    "space-before-blocks": [0, "always"],
    'key-spacing':0,
    "padded-blocks": 0,
    "semi": [1, "always"],
    "arrow-spacing": 0,
    "keyword-spacing":1,
    "semi-spacing": [0, {"before": false, "after": true}],
    "quotes": [1, "single"],
    "comma-spacing": 0,
    "no-multi-spaces": 1,
    "quote-props":[1, "always"],
    "no-useless-return":1,
    "space-infix-ops": 0,
    "vue/no-unused-vars":1,
    "no-unused-vars":1,
    "camelcase": 1,
    "space-in-parens": [0, "never"]
  }

}
