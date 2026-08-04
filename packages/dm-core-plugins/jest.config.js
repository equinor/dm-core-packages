const packageJson = require('./package.json')
const base = require('../../jest.config.base')
module.exports = {
  ...base,
  testEnvironment: "jsdom",
  displayName: packageJson.name,
  setupFilesAfterEnv: ["./jestSetup.js"],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    "^@development-framework/dm-core$": "<rootDir>/../dm-core/src/index.tsx",
  },
};
