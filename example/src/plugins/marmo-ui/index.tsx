import { TPlugin } from '@development-framework/dm-core'

//views
import { SignalPlot } from './containers/views/SignalPlot'
import { SignalTable } from './containers/views/SignalTable/SignalTable'

export const plugins: TPlugin[] = [
  {
    pluginName: 'marmo-ess-plot-view',
    component: SignalPlot,
  },

  {
    pluginName: 'marmo-ess-table-view',
    component: SignalTable,
  },
]
