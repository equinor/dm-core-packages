import styled from 'styled-components'
import * as Styled from '../styles'

export const PaletteCard = styled(Styled.PaletteCard)<{ $dragging: boolean }>`
  opacity: ${(props) => (props.$dragging ? 0.4 : 1)};
`
