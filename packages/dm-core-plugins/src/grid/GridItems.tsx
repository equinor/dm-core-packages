import { TItemBorder, TGridItem } from './types'
import React from 'react'
import { GridElement } from './GridElement'

type GridItemsProps = {
  items: TGridItem[]
  idReference: string
  type: string
  itemBorder: TItemBorder
  showItemBorders: boolean
  onSubmit?: (data: any) => void
  onChange?: (data: any) => void
}

export const GridItems = (props: GridItemsProps) => {
  const {
    idReference,
    items,
    type,
    itemBorder,
    showItemBorders,
    onChange,
    onSubmit,
  } = props
  const elements = items.map((item: TGridItem, index) => {
    return (
      <GridElement
        key={`${idReference}-${index}`}
        idReference={idReference}
        item={item}
        type={type}
        itemBorder={itemBorder}
        showItemBorders={showItemBorders}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  })
  return <>{elements}</>
}
