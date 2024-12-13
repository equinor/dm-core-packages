const crypto = require('node:crypto')

Object.defineProperty(window, 'crypto', {
  value: crypto,
})
