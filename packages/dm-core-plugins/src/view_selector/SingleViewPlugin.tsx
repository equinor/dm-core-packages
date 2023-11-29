import React from 'react'
import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import { TViewSelectorConfig } from './types'

export const SingleViewPlugin = (
  props: IUIPlugin & { config?: TViewSelectorConfig }
): React.ReactElement => {
  const { idReference } = props

  const { document, isLoading, error } = useDocument<any>(idReference)

  if (error) {
    throw new Error(JSON.stringify(error, null, 2))
  }
  if (isLoading) {
    return <Loading />
  }

  return <div>{document?.type}</div>
}
