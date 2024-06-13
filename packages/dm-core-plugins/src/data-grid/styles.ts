import { tokens } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'

export const DataGrid = styled.table`
  width: 100%;
  max-width: 100%;
  vertical-align: top;
  overflow-x: auto;
  white-space: nowrap;
  border-collapse: collapse;
  border-spacing: 0;
  border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
  tbody {
    > tr {
      &:nth-child(odd) {
        td {
          background-color: ${tokens.colors.ui.background__light.rgba};
        }
      }
    }
  }
`

export const Row = styled.tr`
  position: relative;
  th {
    border: 1px solid ${tokens.colors.ui.background__medium.rgba};
    border-bottom: 0;
    background-clip: padding-box;
    padding: 0;
    position: relative;
  }
`

export const Head = styled.thead`
  font-weight: bold;
  th {
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};
    text-align: center;
  }
`

type IStyledCell = {
  selected?: boolean
  attributeType?: string
}
export const Cell = styled.td<IStyledCell>`
  border: 1px solid ${tokens.colors.ui.background__medium.rgba};
  border-bottom: 0;
  position: relative;
  background-clip: padding-box;
  padding: 0;
  ${({ selected }) =>
    selected &&
    css`
      background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba}!important;
  `}
  ${({ attributeType }) =>
    attributeType === 'boolean' &&
    css`
      text-align: center;
  `}
`

export const Header = styled.th<{ selected?: boolean }>`
  background: ${({ selected }) =>
    selected ? 'rgba(0, 0, 0, 0.2)' : 'transparent'};
  cursor: pointer;
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
  border: none;

  ${({ attributeType }) =>
    attributeType === 'number' &&
    css`
    text-align: right;

    /* Chrome, Safari, newer versions of Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type='number'] {
      -moz-appearance: textfield;
    }
  `}
`

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
  border-left: 1px solid ${tokens.colors.ui.background__medium.rgba};
  min-width: max-content;
`

export const ActionRowButton = styled.button`
  background: none;
  margin: 0;
  padding: 0.25rem;
  border: none;
  border-right: 1px solid ${tokens.colors.ui.background__medium.rgba};
  height: 1.5rem;
  cursor: pointer;
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

export const Select = styled.select`
  background: transparent;
  font-size: 0.75rem;
  height: 0.75rem;
  border: none;
`
