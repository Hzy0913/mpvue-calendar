module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-named-as-default': ['off'],
    'comma-dangle': ['off', 'never'],
    'spaced-comment': ['off', 'always'],
    'func-names': ['off'],
//    'indent': ['error', 2, {'SwitchCase': 1}], //暂时关闭
    'indent': 0, //暂时关闭
    'import/prefer-default-export': 0, //暂时关闭
    'no-unused-expressions': ['off'],
//    'max-len': ['warn', 100, 2, {'ignoreComments': true}], //暂时关闭
    'max-len': 0,
    'object-curly-spacing': 0,
    /* 暂时关闭 */
    'arrow-parens': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'array-callback-return': 0,
    'class-methods-use-this': 0,
    'default-case': 0,
    'no-continue': 0,
    'prefer-template': 0,
    'consistent-return': 0,
    'global-require': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-bitwise': 0,
    'no-case-declarations': 0,
    'no-confusing-arrow': 0,
    'no-mixed-operators': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-return-assign': 0,
    'no-underscore-dangle': 0,
    'prefer-object-spread': 0,
    'no-unused-vars': 0,
    'no-useless-concat': 0,
    'object-curly-newline': 0,
    'no-restricted-globals': 0,
    'no-else-return': 0,
    'space-infix-ops': 0,
    'prefer-destructuring': ['error', {
      'VariableDeclarator': {
        'array': false,
        'object': false
      },
      'AssignmentExpression': {
        'array': false,
        'object': false
      }
    }, {
      'enforceForRenamedProperties': true
    }]
  },
};
