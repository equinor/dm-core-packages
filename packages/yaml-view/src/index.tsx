import * as React from 'react'

import './index.css'
import {
  EPluginType,
  IUIPlugin,
  Loading,
  useDocument,
} from '@development-framework/dm-core'
import PreviewPlugin from './YamlPlugin'

const PluginComponent = (props: IUIPlugin) => {
  const { idReference } = props
  // eslint-disable-next-line
  const [document, loading, updateDocument, error] = useDocument(
    idReference,
    999
  )
  if (loading) return <Loading />
  if (error) {
    const errorResponse =
      typeof error.response?.data == 'object'
        ? error.response?.data?.message
        : error.response?.data
    return <pre style={{ color: 'red' }}>{errorResponse}</pre>
  }
  return <PreviewPlugin document={document} />
}

//TODO add type. TPlugin in dm-core must be updated to avoid error.
export const plugins: any = [
  {
    pluginName: 'yaml-view',
    pluginType: EPluginType.UI,
    component: PluginComponent,
  },
]
