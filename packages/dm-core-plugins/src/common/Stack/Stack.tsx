import { forwardRef } from 'react'
import { StyledStack } from './styles'
import { StackProps, defaultProps } from './types'

export const Stack = forwardRef((props: StackProps, ref) => {
  const mergedProps = { ...defaultProps, ...props }
  return (
    <StyledStack
      ref={ref as React.RefObject<HTMLDivElement>}
      {...mergedProps}
    />
  )
})
