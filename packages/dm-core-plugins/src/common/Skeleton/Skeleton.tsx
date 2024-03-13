import { tokens } from '@equinor/eds-tokens'
import styled, { keyframes } from 'styled-components'

type SkeletonProps = {
  height?: string | number
}

const skeletonAnimation = keyframes`
 to { background-position: left; }
`

const colors = {
  background: '#e0e0e0',
  foreground: tokens.colors.ui.background__light.hex,
}

const StyledSkeleton = styled.span<SkeletonProps>`
    display: inline-block;
    width: 100%;
    height: ${({ height }) =>
      typeof height === 'number' ? `${height}px` : height};
    background:linear-gradient(90deg, ${colors.background} 40%, ${
      colors.foreground
    }, ${colors.background} 60%) right/300% 100% ;
    border-radius: 0.25rem;
    animation: ${skeletonAnimation} 1.2s infinite linear;
`

export function Skeleton(props: SkeletonProps) {
  const { height = '1rem' } = props
  return <StyledSkeleton height={height} />
}
