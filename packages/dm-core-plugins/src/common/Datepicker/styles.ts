import { Button } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled, { css } from 'styled-components'

export const OptionsGrid = styled.div<{ columns?: number }>`
    display: grid;
    grid-template-columns: repeat(${(props) => props.columns || 3}, minmax(0, 1fr));
`

export const StyledOptionButton = styled(Button)<{
  selected?: boolean
  lessVisible?: boolean
  highlighted?: boolean
}>`
    color: ${tokens.colors.text.static_icons__default.hex};
    padding: 0.25rem 0.5rem;
    position: relative;
    ${(props) =>
      props.selected &&
      css`
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
        color: ${tokens.colors.interactive.primary__resting.rgba};
    `}
    ${(props) =>
      props.lessVisible &&
      css`
        color: rgba(170, 170, 170, 1);
    `}
    ${(props) =>
      props.highlighted &&
      css`
      &:after {
        position: absolute;
        top: 1.75rem;
        left: calc(50% - .125rem);
        background:  ${tokens.colors.interactive.primary__resting.rgba};
        height: 0.25rem;
        width: 0.25rem;
        border-radius: 50%;
      }
    `}
`
