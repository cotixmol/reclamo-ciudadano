module.exports = {
    extends: [
      'next',
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  };
  