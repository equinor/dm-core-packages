// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto')

Object.defineProperty(window, 'crypto', {
  value: crypto,
})
