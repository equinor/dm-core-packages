import { Button } from '@equinor/eds-core-react'
import styled from 'styled-components'

export const MediaWrapper = styled.div<{ $height?: number; $width?: number }>`
  height: fit-content;
  width: fit-content;
  position: relative;
`

export const MetaPopoverButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 50;
  color: #595959;
`
