import * as React from 'react'

import './index.css'
import {
  EPluginType,
  IDmtUIPlugin,
  Loading,
  TPlugin,
  useDocument,
} from '@development-framework/dm-core'
import PreviewPlugin from './YamlPlugin'

const PluginComponent = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  // eslint-disable-next-line
  const [document, loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
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

export const plugins: TPlugin[] = [
  {
    pluginName: 'yaml-view',
    pluginType: EPluginType.UI,
    component: PluginComponent,
  },
]
