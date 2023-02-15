import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TPlugin,
} from '@development-framework/dm-core'
import { useDocument } from '@development-framework/dm-core'

const PluginComponent = (props: IUIPlugin) => {
  const { idReference, validate } = props
  const [document, loading] = useDocument<TGenericObject>(idReference, 999)
  const dataSource = idReference.split('/')[0]

  if (loading || document === null) return <Loading />
  validate(document)
  return <ViewerPDFPlugin document={document} dataSourceId={dataSource} />
}

export const plugins: TPlugin[] = [
  {
    pluginName: 'default-pdf',
    component: PluginComponent,
    // Name of the blueprint that should be used to validate entities before passing
    // them to this component.
    // NB: The blueprint must exist in the "validationBlueprintsPackage" defined in the apps "plugins.js"
    // @ts-ignore
    validationBlueprint: 'PDFViewerValidation',
  },
]
