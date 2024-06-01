

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '@dynatrace/runtime-simulator/lib/test-environment',
  clearMocks: true,
};
