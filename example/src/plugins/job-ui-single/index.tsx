import { TPlugin } from '@development-framework/dm-core'
import { JobPlugin } from './pages/JobPlugin'

export const plugins: TPlugin[] = [
  {
    pluginName: 'signal-job-single',
    component: JobPlugin,
  },
]
