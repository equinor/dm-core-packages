import styled, { css } from 'styled-components'

import { StackProps } from './types'

export const StyledStack = styled.div<StackProps>`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(props) => props.direction};
  flex-grow: ${(props) => props.grow};
  flex-shrink: ${(props) => props.shrink};
  flex-wrap: ${(props) => props.wrap};
  min-height: ${(props) =>
    props.minHeight !== undefined ? `${props.minHeight}px` : 'initial'};
  position: ${(props) => props.position};
  width: ${(props) => (props.fullWidth ? '100%' : 'initial')};
  height: ${(props) => (props.fullHeight ? '100%' : 'initial')};
  overflow-y: ${(props) => (props.scrollY ? 'auto' : 'initial')};
  overflow-x: ${(props) => (props.scrollX ? 'auto' : 'initial')};

  // alignments
  align-items: ${(props) => props.alignItems};
  align-content: ${(props) => props.alignContent};
  align-self: ${(props) => props.alignSelf};
  justify-content: ${(props) => props.justifyContent};
  
  // spacings
  gap: ${(props) => `${props.spacing}rem`};

  ${(props) =>
    Array.isArray(props.padding)
      ? css`
        padding: ${props.padding?.map((value) => `${value}rem`)?.join(' ')};
      `
      : css`
        padding: ${props.padding}rem;
        `}

  ${(props) =>
    Array.isArray(props.margin)
      ? css`
        margin: ${props.margin?.map((value) => `${value}rem`)?.join(' ')};
      `
      : css`
        margin: ${props.margin}rem;
        `}
`
