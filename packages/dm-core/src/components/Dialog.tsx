import { Dialog as EdsDialog } from '@equinor/eds-core-react'
import styled from 'styled-components'

export const Dialog = styled(EdsDialog)<{ width?: string; height?: string }>`
  height: ${(props) => props.height || '100%'};
  overflow: auto;
  width: ${(props) => props.width || '100%'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
Dialog.Header = styled(EdsDialog.Header)``
Dialog.Title = styled(EdsDialog.Title)``
Dialog.CustomContent = styled(EdsDialog.CustomContent)`
  flex-grow: 2;
`
Dialog.Actions = styled(EdsDialog.Actions)`
  display: flex;
  gap: 1rem;
  align-self: auto;
`
