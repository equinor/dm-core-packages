import { TBaseGridItem, TGridArea } from './types'
import styled from 'styled-components'
import React from 'react'
import { TGenericObject, ViewCreator } from '@development-framework/dm-core'

const Element = styled.div`
  grid-area: ${(props: TGridArea) =>
    `${props.rowStart} / ${props.columnStart} / ${props.rowEnd} / ${props.columnEnd} `};
`

type TGridItemProps = {
  idReference: string
  item: TBaseGridItem
  document: TGenericObject
}

export const GridElement = (props: TGridItemProps): JSX.Element => {
  const { idReference, document, item } = props

  return (
    <Element
      rowStart={item.gridArea.rowStart}
      rowEnd={item.gridArea.rowEnd}
      columnStart={item.gridArea.columnStart}
      columnEnd={item.gridArea.columnEnd}
    >
      <ViewCreator
        idReference={idReference}
        document={document}
        viewConfig={item.viewConfig}
      />
    </Element>
  )
}
