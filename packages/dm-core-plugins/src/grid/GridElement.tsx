import { TBaseGridItem, TGridArea } from './types'
import styled from 'styled-components'
import React from 'react'
import { UIPluginSelector } from '@development-framework/dm-core'

const Element = styled.div`
  grid-area: ${(props: TGridArea) =>
    `${props.rowStart} / ${props.columnStart} / ${props.rowEnd} / ${props.columnEnd} `};
`

type TGridItemProps = {
  idReference: string
  type: string
  config?: object
  item: TBaseGridItem
}

export const GridElement = (props: TGridItemProps): JSX.Element => {
  const { idReference, type, config, item } = props

  return (
    <Element
      rowStart={item.gridArea.rowStart}
      rowEnd={item.gridArea.rowEnd}
      columnStart={item.gridArea.columnStart}
      columnEnd={item.gridArea.columnEnd}
    >
      <UIPluginSelector type={type} idReference={idReference} config={config} />
    </Element>
  )
}
