import { TUiPluginMap } from '@development-framework/dm-core'

//views
import { SignalPlot } from './containers/views/SignalPlot'
import { SignalTable } from './containers/views/SignalTable/SignalTable'

export const plugins: TUiPluginMap = {
  'marmo-ess-plot-view': {
    pluginName: 'marmo-ess-plot-view',
    component: SignalPlot,
  },
  'marmo-ess-table-view': {
    pluginName: 'marmo-ess-table-view',
    component: SignalTable,
  },
}
