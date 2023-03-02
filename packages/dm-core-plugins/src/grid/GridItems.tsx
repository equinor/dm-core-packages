import { isAttributeGridItem, TGridItem } from './types'
import { TGenericObject } from '@development-framework/dm-core'
import React from 'react'
import { GridElement } from './GridElement'

type GridItemsProps = {
  items: TGridItem[]
  type: string
  idReference: string
  document: TGenericObject
}

export const GridItems = (props: GridItemsProps) => {
  const { idReference, document, type, items } = props
  const elements = items.map((item: TGridItem) => {
    if (isAttributeGridItem(item)) {
      // TODO: Handle nested attributes?
      const config = item.uiRecipes
        ? {
            recipes: item.uiRecipes,
          }
        : {}
      return (
        <GridElement
          key={`${idReference}.${item.attribute}`}
          item={item}
          idReference={`${idReference}.${item.attribute}`}
          type={document[item.attribute].type}
          config={config}
        />
      )
    } else {
      return (
        <GridElement
          key={`${idReference}.${item.uiRecipes.join('-')}`}
          item={item}
          idReference={idReference}
          type={type}
          config={{
            recipes: item.uiRecipes,
          }}
        />
      )
    }
  })
  return <>{elements}</>
}
