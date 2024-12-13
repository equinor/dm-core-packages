const crypto = await import('node:crypto')

Object.defineProperty(window, 'crypto', {
  value: crypto,
})
