import React from 'react'
import styled from 'styled-components'
import { GridItems } from './GridItems'
import { TGridPluginConfig, TGridSize } from './types'

const Grid = styled.div<TGridSize>`
  display: grid;
  grid-template-columns: repeat(${(props: TGridSize) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props: TGridSize) => props.rows}, 1fr);
  column-gap: ${({ columnGap }) => columnGap || 16}px;
  row-gap: ${({ rowGap }) => rowGap || 16}px;
`

export const GridPlugin = (props: TGridPluginConfig): React.ReactElement => {
  const { config, idReference, type } = props

  return (
    <Grid
      columns={config.size.columns}
      rows={config.size.rows}
      rowGap={config.size.rowGap}
      columnGap={config.size.columnGap}
    >
      <GridItems idReference={idReference} items={config.items} type={type} />
    </Grid>
  )
}
