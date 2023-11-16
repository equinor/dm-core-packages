import React from 'react'
import styled from 'styled-components'
import { GridItems } from './GridItems'
import { TGridPluginConfig, TGridSize } from './types'
import { IUIPlugin } from '@development-framework/dm-core'

const Grid = styled.div<TGridSize>`
  display: grid;
  grid-template-rows: ${(props) =>
    props.rowSizes
      ? props.rowSizes.join(' ')
      : Array(props.rows + 1)
          .fill('1fr')
          .join('')};
  grid-template-columns: ${(props) =>
    props.columnSizes
      ? props.columnSizes.join(' ')
      : Array(props.columns + 1)
          .fill('1fr')
          .join('')};
  grid-column-gap: ${(props) => props.columnGap};
  grid-row-gap: ${(props) => props.rowGap};
`

const defaultConfig: TGridPluginConfig = {
  items: [],
  itemBorder: {
    size: '1px',
    color: '#bbb',
    style: 'solid',
    radius: '5px',
  },
  size: {
    columns: 1,
    rows: 1,
    rowGap: '16px',
    columnGap: '16px',
  },
  showItemBorders: false,
}

export const GridPlugin = (
  props: IUIPlugin & { config: TGridPluginConfig }
): React.ReactElement => {
  const { config, idReference, type } = props

  const internalConfig: TGridPluginConfig = {
    ...defaultConfig,
    ...config,
    itemBorder: { ...defaultConfig.itemBorder, ...config.itemBorder },
    size: { ...defaultConfig.size, ...config.size },
  }

  return (
    <Grid {...internalConfig.size}>
      <GridItems
        idReference={idReference}
        items={internalConfig.items}
        itemBorder={internalConfig.itemBorder}
        showItemBorders={internalConfig.showItemBorders}
        type={type}
      />
    </Grid>
  )
}
