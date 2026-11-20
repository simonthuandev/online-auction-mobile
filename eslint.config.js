const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    rules: {
      'import/no-named-as-default-member': 'off',
    },
    ignores: ['dist/*', '.expo/*', 'src/contracts/api.generated.ts'],
  },
];
