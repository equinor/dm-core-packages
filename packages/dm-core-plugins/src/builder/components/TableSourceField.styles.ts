import styled from 'styled-components'
import * as Styled from '../styles'

export const HiddenInput = styled.input`
  display: none;
`

export const MonospaceTextarea = styled(Styled.Textarea)`
  font-family: monospace;
  min-height: 140px;
`

export const ErrorHelp = styled(Styled.FieldHelp)`
  color: #c00;
`
