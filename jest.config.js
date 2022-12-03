/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!lowdb|steno)'],
  transform: {
    '^.+\\.(js)?$': require.resolve('babel-jest'),
  },
};
