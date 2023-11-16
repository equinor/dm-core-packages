import { TItemBorder, TGridItem } from './types'
import React from 'react'
import { GridElement } from './GridElement'

type GridItemsProps = {
  items: TGridItem[]
  idReference: string
  type: string
  itemBorder: TItemBorder
  showItemBorders: boolean
}

export const GridItems = (props: GridItemsProps) => {
  const { idReference, items, type, itemBorder, showItemBorders } = props
  const elements = items.map((item: TGridItem, index) => {
    return (
      <GridElement
        key={`${idReference}-${index}`}
        idReference={idReference}
        item={item}
        type={type}
        itemBorder={itemBorder}
        showItemBorders={showItemBorders}
      />
    )
  })
  return <>{elements}</>
}
