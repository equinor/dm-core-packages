import { Button } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'

export const DataGrid = styled.div`
  width: 100%;
  display: table;
  justify-content: stretch ;
  align-items: center;
  border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
  > div {
    &:nth-child(odd) {
      background: ${tokens.colors.ui.background__light.rgba};
    }
  }
`

export const Row = styled.div<{ header?: boolean; selected?: boolean }>`
  width: 100%;
  display: table-row;
  justify-content: stretch ;
  align-items: stretch;
  font-weight: ${({ header }) => (header ? 'bold' : 'normal')};
`

export const Cell = styled.div<{
  header?: boolean
  selected?: boolean
  attributeType?: string
}>`
  border: 1px solid ${tokens.colors.ui.background__medium.rgba};
  border-bottom: none;
  display: table-cell;
  position: relative;
  ${({ header }) =>
    header &&
    css`
      border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};
  `}
  ${({ selected }) =>
    selected &&
    css`
      background: ${tokens.colors.interactive.primary__selected_highlight.rgba};
  `}
  ${({ attributeType }) =>
    attributeType === 'boolean' &&
    css`
      text-align: center;
  `}
`

export const RowButton = styled.button<{ selected?: boolean }>`
  height: 100%;
  width: 100%;
  position: absolute;
  background: ${({ selected }) =>
    selected ? 'rgba(0, 0, 0, 0.2)' : 'transparent'};
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  svg {
    fill: #666;
  }
`

export const Input = styled.input<{ attributeType: string }>`
  width: 100%;
  padding: 0 0.25rem;
  background: transparent;
  ${({ attributeType }) =>
    attributeType === 'number' &&
    css`
      text-align: right;
  `}
`

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${tokens.colors.ui.background__light.rgba};
  border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
`

export const ActionRowButton = styled.button`
  margin: 0;
  padding: 0.25rem;
  border-right: 1px solid ${tokens.colors.ui.background__medium.rgba};
  &:hover {
    background: ${tokens.colors.ui.background__medium.rgba};
  }
  &:disabled {
    svg {
      fill: rgba(0, 0, 0, 0.3)
    }
    cursor: default;
    &:hover {
      background: transparent;
    }
  }
`

export const SaveButton = styled(Button)`
  padding: 0.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  line-height: 0;
`

export const Select = styled.select`
  background: transparent;
  font-size: 0.75rem;
  height: 0.75rem;
`
