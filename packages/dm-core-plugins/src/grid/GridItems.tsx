import { TGridItem } from './types'
import { TGenericObject } from '@development-framework/dm-core'
import React from 'react'
import { GridElement } from './GridElement'

type GridItemsProps = {
  items: TGridItem[]
  idReference: string
  document: TGenericObject
}

export const GridItems = (props: GridItemsProps) => {
  const { idReference, document, items } = props
  const elements = items.map((item: TGridItem, index) => {
    return (
      <GridElement
        key={`${idReference}-${index}`}
        idReference={idReference}
        document={document}
        item={item}
      />
    )
  })
  return <>{elements}</>
}
