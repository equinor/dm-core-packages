import styled, { css } from 'styled-components'

export const CustomToggle = styled.div<{ expanded: boolean }>`
    width: 72px;
    display: grid;
    place-items: center;
    margin-block: 8px;
    svg {
        transition: ease-in-out all 0.2s;
    }

    ${({ expanded }) =>
      expanded &&
      css`
        svg {
            transform: rotate(180deg);
        }
    `}
`
