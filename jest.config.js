module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js', 'json', 'vue', 'svg'],
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.ts$': 'ts-jest',
    // 'typed-vuex': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
  moduleNameMapper: {
    '^[@~]/(.*)$': '<rootDir>/src/$1',
    '^helper$': '<rootDir>/__tests__/helper',
  },
  setupFiles: ['jest-localstorage-mock', '<rootDir>/__tests__/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupAfter.ts'],
  testRegex: '(/__tests__/(components|pages)/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  // transformIgnorePatterns: ['typed-vuex'],
  transformIgnorePatterns: [],
  collectCoverageFrom: [
    'src/assets/ts/**/*',
    'src/components/**/*',
    'src/store/**/*',
    'src/assets/ts/**/*',
    'src/layouts/js/**/*',
    'src/pages/js/**/*',
  ],
}
