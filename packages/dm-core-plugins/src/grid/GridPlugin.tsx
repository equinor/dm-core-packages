import {
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'

import React from 'react'
import styled from 'styled-components'
import { TGridSize, TGridPluginConfig } from './types'
import { GridItems } from './GridItems'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props: TGridSize) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props: TGridSize) => props.rows}, 1fr);
  grid-column-gap: 5px;
  grid-row-gap: 5px;
`

export const GridPlugin = (props: TGridPluginConfig): JSX.Element => {
  const { config, idReference, type } = props
  const [document, isLoadingDocument] = useDocument<TGenericObject>(idReference)

  if (isLoadingDocument) return <Loading />

  return (
    <Grid columns={config.size.columns} rows={config.size.rows}>
      <GridItems
        idReference={idReference}
        type={type}
        document={document || {}}
        items={config.items}
      />
    </Grid>
  )
}
