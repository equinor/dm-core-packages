const packageJson = require('./package.json')
const base = require('../../jest.config.base')

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  displayName: packageJson.name,
}
