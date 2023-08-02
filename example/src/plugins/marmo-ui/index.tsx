import { TUiPluginMap } from '@development-framework/dm-core'

//views
import { SignalPlot } from './containers/views/SignalPlot'
import { SignalTable } from './containers/views/SignalTable/SignalTable'

export default {
  'marmo-ess-plot-view': {
    component: SignalPlot,
  },
  'marmo-ess-table-view': {
    component: SignalTable,
  },
} as TUiPluginMap
