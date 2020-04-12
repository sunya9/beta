module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js', 'json', 'vue', 'svg'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub'
  },
  moduleNameMapper: {
    '^[@~]/(.*)$': '<rootDir>/$1',
    '^helper$': '<rootDir>/__tests__/helper'
  },
  setupFiles: ['jest-localstorage-mock', '<rootDir>/__tests__/setup.ts'],
  testRegex: '(/__tests__/(components|pages)/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transformIgnorePatterns: ['node_modules/(?!(nuxt)/)'],
  collectCoverageFrom: [
    'assets/ts/**/*',
    'components/**/*',
    'store/**/*',
    'assets/ts/**/*',
    'layouts/js/**/*',
    'pages/js/**/*'
  ]
}
