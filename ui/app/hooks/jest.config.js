/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  rootDir: '.',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { types: ['node', 'jest'] } }],
  },
};
