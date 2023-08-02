import { TUiPluginMap } from '@development-framework/dm-core'
import { JobPlugin } from './pages/JobPlugin'

export const plugins: TUiPluginMap = {
  'signal-job-single': {
    component: JobPlugin,
  },
}
