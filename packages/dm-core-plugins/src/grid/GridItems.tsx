import { TGridItem } from './types'
import React from 'react'
import { GridElement } from './GridElement'

type GridItemsProps = {
  items: TGridItem[]
  idReference: string
}

export const GridItems = (props: GridItemsProps) => {
  const { idReference, items } = props
  const elements = items.map((item: TGridItem, index) => {
    return (
      <GridElement
        key={`${idReference}-${index}`}
        idReference={idReference}
        item={item}
      />
    )
  })
  return <>{elements}</>
}
