const path = require('path')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')

module.exports = {
  webpack: {
    configure: (config) => {
      // Remove guard against importing modules outside of \`src\`.
      // Needed for workspace projects.
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      )

      // Add support for importing workspace projects.
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          mainFields: ['module', 'main'],
        })
      )

      if ((process.env.NODE_ENV || '').trim() === 'development') {
        config.resolve.alias = {
          '@development-framework/dm-core': path.resolve(
            __dirname,
            '../packages/dm-core/src/index.tsx'
          ),
          '@development-framework/dm-core-plugins': path.resolve(
            __dirname,
            '../packages/dm-core-plugins/src/index.tsx'
          ),
        }
      }

      const oneOfRule = config.module.rules.find((rule) => rule.oneOf)
      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      oneOfRule.oneOf.forEach((r) => {
        if (r.loader && r.loader.indexOf('babel') !== -1) {
          r.exclude = /.yarn/
          delete r.include
        }
      })

      return config
    },
  },
}
