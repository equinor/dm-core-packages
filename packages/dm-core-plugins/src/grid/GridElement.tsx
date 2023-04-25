import { TGridItem, TGridArea } from './types'
import styled from 'styled-components'
import React from 'react'
import { ViewCreator } from '@development-framework/dm-core'

const Element = styled.div`
  grid-area: ${(props: TGridArea) =>
    `${props.rowStart} / ${props.columnStart} / ${props.rowEnd} / ${props.columnEnd} `};
`

type TGridItemProps = {
  idReference: string
  item: TGridItem
}

export const GridElement = (props: TGridItemProps): JSX.Element => {
  const { idReference, item } = props

  return (
    <Element
      rowStart={item.gridArea.rowStart}
      rowEnd={item.gridArea.rowEnd}
      columnStart={item.gridArea.columnStart}
      columnEnd={item.gridArea.columnEnd}
    >
      <ViewCreator
        idReference={idReference}
        viewConfig={item.viewConfig}
        blueprintAttribute={{
          name: 'nil',
          attributeType: item.type,
          dimensions: '',
        }}
        type={item.type}
      />
    </Element>
  )
}
