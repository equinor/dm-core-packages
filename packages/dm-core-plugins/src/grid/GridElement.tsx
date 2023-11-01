import { ViewCreator } from '@development-framework/dm-core'
import React from 'react'
import styled from 'styled-components'
import { TGridArea, TGridItem } from './types'

const Element = styled.div<TGridArea>`
  grid-area: ${(props: TGridArea) =>
    `${props.rowStart} / ${props.columnStart} / ${props.rowEnd + 1} / ${
      props.columnEnd + 1
    } `};
`

type TGridItemProps = {
  idReference: string
  item: TGridItem
  type: string
}

export const GridElement = (props: TGridItemProps): React.ReactElement => {
  const { idReference, item } = props

  return (
    <Element
      rowStart={item.gridArea.rowStart}
      rowEnd={item.gridArea.rowEnd}
      columnStart={item.gridArea.columnStart}
      columnEnd={item.gridArea.columnEnd}
      data-testid={item.viewConfig.scope}
    >
      <ViewCreator idReference={idReference} viewConfig={item.viewConfig} />
    </Element>
  )
}
