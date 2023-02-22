import React from 'react'

import {IUIPlugin, TPlugin} from '@development-framework/dm-core'
import PreviewPlugin from './PreviewPlugin'

export const DefaultPreviewComponent = (props: IUIPlugin) => {
  return <PreviewPlugin idReference={props.idReference}/>
}

