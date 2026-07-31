import styled from 'styled-components'
import * as Styled from '../styles'

export const NavbarBrand = styled(Styled.NavbarBrand)<{ $editing: boolean }>`
  cursor: ${(props) => (props.$editing ? 'text' : 'default')};
`

export const LabelButton = styled.button`
  font: inherit;
  font-size: 14px;
  color: #3d3d3d;
  background: transparent;
  border: none;
  cursor: text;
  padding: 2px 4px;
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
`

export const RemoveButton = styled.button`
  padding: 6px 8px;
  border: 1px solid #d6534f;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #d6534f;
`
