import styled from 'styled-components'

import { MessageTypes } from './types'

export const StyledMessage = styled.div<{ type: MessageTypes }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ type }) =>
    type === 'error'
      ? '#FFC1C1'
      : type === 'success'
        ? '#E6FAEC'
        : type === 'warning'
          ? '#FFE7D6'
          : '#DEEDEE'};
  svg {
    flex-shrink: 0;
    fill: ${({ type }) =>
      type === 'error'
        ? '#B30D2F'
        : type === 'success'
          ? '#007079'
          : type === 'warning'
            ? '#AD6200'
            : '#007079'};
  }
`

export const StyledMessageContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
`

export const StyledDismissButton = styled.button<{ messageType: MessageTypes }>`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
  background: none;
  font-family: inherit;
  border: none;
  padding: 1rem;
  cursor: pointer;
  color: #333;
  height: 100%;
  transition: background-color ease-in-out 0.3s;
  &:hover {
    background: ${({ messageType }) =>
      messageType === 'error'
        ? '#FF949B'
        : messageType === 'success'
          ? '#C3F3D2'
          : messageType === 'warning'
            ? '#FFDAA8'
            : '#ADE2E6'};
  }
`
