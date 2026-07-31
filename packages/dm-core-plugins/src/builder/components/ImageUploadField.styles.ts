import { Button } from '@equinor/eds-core-react'
import styled from 'styled-components'
import * as Styled from '../styles'

export const HiddenInput = styled.input`
  display: none;
`

export const RemoveButton = styled(Button)`
  margin-top: 4px;
`

export const ErrorHelp = styled(Styled.FieldHelp)`
  color: #c00;
`
