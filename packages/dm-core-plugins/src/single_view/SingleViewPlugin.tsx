import {
  IUIPlugin,
  TViewConfig,
  ViewCreator,
} from '@development-framework/dm-core'
import React from 'react'

export const SingleViewPlugin = (
  props: IUIPlugin & { config: TViewConfig }
): React.ReactElement => {
  const { idReference, config } = props

  return <ViewCreator idReference={idReference} viewConfig={config} />
}
