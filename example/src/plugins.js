import { plugins as dmCorePlugins } from '@development-framework/dm-core-plugins'
import { plugins as jobPlugin } from './plugins/job-ui-single'
import { plugins as marmoPlugins } from './plugins/marmo-ui'

export default {
  ...dmCorePlugins,
  ...jobPlugin,
  ...marmoPlugins,
}
