import styled from 'styled-components'
import { TextField, Typography } from '@equinor/eds-core-react'

export const StyledEdsTextWidget = styled(TextField)`
  & :disabled {
    background: #f7f7f7;
    color: black;
  }
  
  span {
    color: #6f6f6f;
  }
`
