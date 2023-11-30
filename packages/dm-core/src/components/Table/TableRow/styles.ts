import { Input as EDSInput, Table } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

type TStyledTableCell = {
	noPadding?: boolean
}

export const Input = styled(EDSInput)`
  background: transparent;
  border: none;
  box-shadow: none;
  height: 100%;
`

export const TableCell = styled(Table.Cell)<TStyledTableCell>`
  border-right: 1px solid ${tokens.colors.ui.background__medium.hex};
  padding: ${({ noPadding }) => (noPadding ? '0px' : '0 0.5rem')};
`

export const InsertRowButton = styled.button`
  position: absolute;
  background: white;
  height: 24px;
  width: 24px;
  bottom: -11px;
  right: -30px;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition: ease-in-out all 0.2s;
  .resting_state_indicator {
    opacity: 1;
    position: absolute;
    top: calc(50% - 4px);
    right: calc(50% - 4px);
    background: ${tokens.colors.ui.background__medium.hex};
    height: 8px;
    width: 8px;
    border-radius: 50%;
    transition: ease-in-out all 0.2s;
  }
  svg {
    transition: ease-in-out all 0.2s;
    opacity: 0;
  }
  &::after {
    opacity: 0;
    content: '';
    height: 2px;
    width: 50px;
    background: ${tokens.colors.interactive.primary__resting.hex};
    position: absolute;
    left: -50px;
    top: calc(50% - 1px);
    transition: ease-in-out all 0.2s;
  }
  &:hover {
    background: ${tokens.colors.interactive.primary__resting.hex};
    .resting_state_indicator {
      opacity: 0;
    }
    svg {
      opacity: 1;
    }
    &::after {
      opacity: 1;
    }
  }
`
