import React from 'react'
import {
  IUIPlugin,
  TViewConfig,
  ViewCreator,
} from '@development-framework/dm-core'

export const SingleViewPlugin = (
  props: IUIPlugin & { config: TViewConfig }
): React.ReactElement => {
  const { idReference, config } = props

  return <ViewCreator idReference={idReference} viewConfig={config} />
}
