import styled from 'styled-components'
import { type TBreakpoint, type TBreakpoints, breakpoints } from './types'

const createSpacingStyles = (spacing: TBreakpoints) =>
  Object.entries(spacing)
    .filter((bp) => bp[0] !== 'type')
    .map(
      (bp) => `
        @media (min-width: ${breakpoints[bp[0] as TBreakpoint]}px) {
            gap: ${bp[1]}rem;
        }
    `
    )
    .join('')

const createGridItemColumnSizes = (sizes: TBreakpoints) =>
  Object.entries(sizes)
    .filter((bp) => bp[0] !== 'type')
    .map(
      (bp) => `
            @media (min-width: ${breakpoints[bp[0] as TBreakpoint]}px) {
                grid-column: span ${bp[1]};
            }
        `
    )
    .join('')

export const Grid = styled.div<{ spacing?: TBreakpoints }>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  gap: 1rem;
  ${({ spacing }) => (spacing ? createSpacingStyles(spacing) : '')}
`

export const GridItem = styled.div<{ size: TBreakpoints }>`
    grid-column: span 12;
    ${({ size }) => createGridItemColumnSizes(size)}
`
