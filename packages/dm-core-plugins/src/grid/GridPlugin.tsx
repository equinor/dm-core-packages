import { IUIPlugin } from '@development-framework/dm-core'
import React from 'react'
import styled from 'styled-components'
import { GridItems } from './GridItems'
import { TGridPluginConfig, TGridSize } from './types'

const Grid = styled.div<TGridSize>`
  display: grid;
  width: ${(props): string =>
    props.gridWidth ? props.gridWidth + 'px' : '100%'};
  height: ${(props): string =>
    props.gridHeight ? props.gridHeight + 'px' : 'fit-content'};
  grid-template-rows: ${(props) =>
    props.rowSizes
      ? props.rowSizes.join(' ')
      : 'repeat(' + props.rows + ', 1fr)'};
  grid-template-columns: ${(props) =>
    props.columnSizes
      ? props.columnSizes.join(' ')
      : 'repeat(' + props.columns + ', 1fr)'};
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
  const { config, idReference, type, onSubmit, onChange } = props

  const internalConfig: TGridPluginConfig = {
    ...defaultConfig,
    ...config,
    itemBorder: { ...defaultConfig.itemBorder, ...config.itemBorder },
    size: { ...defaultConfig.size, ...config.size },
  }

  return (
    <Grid className='dm-parent-plugin' {...internalConfig.size}>
      <GridItems
        idReference={idReference}
        items={internalConfig.items}
        itemBorder={internalConfig.itemBorder}
        showItemBorders={internalConfig.showItemBorders}
        type={type}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </Grid>
  )
}
