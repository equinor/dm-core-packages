import * as path from 'path'

export const localConfig = () => {
  if ((process.env.ALIAS || '').trim() === 'on') {
    // This is to support hot-reloading of locally linked dm-core dependencies
    console.info('Adding alias to enable hot-reloading of dm-core packages')
    const alias_config = {
      alias: {
        // react: path.resolve(__dirname, './node_modules/react'),
        '@development-framework/dm-core/dist/main.css': path.resolve(
          __dirname,
          './../packages/dm-core/src/styles/main.css'
        ),
        '@development-framework/dm-core': path.resolve(
          __dirname,
          './../packages/dm-core/src/index.tsx'
        ),
        '@development-framework/dm-core-plugins': path.resolve(
          __dirname,
          './../packages/dm-core-plugins/src/index.tsx'
        ),
      },
    }
    return alias_config
  }
  return {}
}
