require('@marvinroger/fusee/patches/eslint-deps')
const fuseeConfig = require('./fusee').getEslintConfig()

module.exports = {
  ...fuseeConfig,
  rules: {
    ...fuseeConfig.rules,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'eslint-comments/disable-enable-pair': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'eslint-comments/no-unused-disable': 'off',
  },
}
