import { TGridItem } from './types'
import React from 'react'
import { GridElement } from './GridElement'

type GridItemsProps = {
  items: TGridItem[]
  idReference: string
  type: string
}

export const GridItems = (props: GridItemsProps) => {
  const { idReference, items, type } = props
  const elements = items.map((item: TGridItem, index) => {
    return (
      <GridElement
        key={`${idReference}-${index}`}
        idReference={idReference}
        item={item}
        type={type}
      />
    )
  })
  return <>{elements}</>
}
