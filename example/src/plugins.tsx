import dmCorePlugins from '@development-framework/dm-core-plugins'
import jobPlugin from './plugins/job-ui-single'
import marmoPlugins from './plugins/marmo-ui'

export default {
  ...dmCorePlugins,
  ...jobPlugin,
  ...marmoPlugins,
}
