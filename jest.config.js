module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '^[@~]/(.*)$': '<rootDir>/$1',
    '^helper$': '<rootDir>/__tests__/helper',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__tests__/fixtures/file.js'
  },
  setupFiles: ['jest-localstorage-mock', '<rootDir>/__tests__/setup'],
  testRegex: '(/__tests__/(components|pages)/.*|(\\.|/)(test|spec))\\.jsx?$',
  transformIgnorePatterns: ['node_modules/(?!(nuxt)/)'],
  collectCoverageFrom: [
    'assets/js/**/*',
    'components/**/*',
    'store/**/*',
    'assets/js/**/*',
    'layouts/js/**/*',
    'pages/js/**/*'
  ]
}
