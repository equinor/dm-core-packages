import dmCorePlugins from '@development-framework/dm-core-plugins'
import marmoPlugins from './plugins/marmo-ui'
import localPlugins from './plugins/table'

export default {
	...dmCorePlugins,
	...marmoPlugins,
	...localPlugins,
}
