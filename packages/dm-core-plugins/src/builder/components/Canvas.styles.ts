import { Icon } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import type { CSSProperties } from 'react'
import styled from 'styled-components'
import * as Styled from '../styles'

const colorPrimary = tokens.colors.interactive.primary__resting.hex

export const CanvasItem = styled(Styled.CanvasItem)<{
  $gridArea: string
  $transform?: string
}>`
  grid-area: ${(props) => props.$gridArea};
  transform: ${(props) => props.$transform};
`

export const BlockIcon = styled(Icon)`
  margin-right: 4px;
  vertical-align: middle;
`

export const CanvasItemBody = styled(Styled.CanvasItemBody)<{
  $alignItems: CSSProperties['alignItems']
  $justifyContent: CSSProperties['justifyContent']
}>`
  flex-direction: column;
  align-items: ${(props) => props.$alignItems};
  justify-content: ${(props) => props.$justifyContent};
`

export const ItemTitle = styled.div<{
  $textAlign?: CSSProperties['textAlign']
  $fontSize: string
  $fontWeight: number
  $color: string
  $padding?: CSSProperties['padding']
}>`
  text-align: ${(props) => props.$textAlign};
  font-size: ${(props) => props.$fontSize};
  font-weight: ${(props) => props.$fontWeight};
  color: ${(props) => props.$color};
  padding: ${(props) => props.$padding};
`

export const ItemBodyText = styled.div<{
  $textAlign?: CSSProperties['textAlign']
  $fontSize?: string
  $fontWeight?: number
  $color?: string
  $padding?: CSSProperties['padding']
}>`
  text-align: ${(props) => props.$textAlign};
  font-size: ${(props) => props.$fontSize};
  font-weight: ${(props) => props.$fontWeight};
  color: ${(props) => props.$color};
  padding: ${(props) => props.$padding};
`

export const CanvasGrid = styled(Styled.CanvasGrid)<{ $isOver: boolean }>`
  outline: ${(props) => (props.$isOver ? `2px dashed ${colorPrimary}` : 'none')};
`
