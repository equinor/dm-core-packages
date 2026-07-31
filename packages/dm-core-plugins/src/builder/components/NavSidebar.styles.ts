import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'
import * as Styled from '../styles'

export const NavItem = styled(Styled.NavItem)<{ $depth: number }>`
  padding-left: ${(props) => 8 + props.$depth * 14}px;
`

export const IconButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${(props) =>
    props.$active
      ? tokens.colors.text.static_icons__primary_white.hex
      : tokens.colors.text.static_icons__tertiary.hex};
`
