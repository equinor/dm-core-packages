import { StyledStack } from './styles'
import { StackProps, defaultProps } from './types'

export const Stack = (props: StackProps) => {
  const mergedProps = { ...defaultProps, ...props }
  const { grow, shrink, direction, wrap, ...restProps } = mergedProps
  return (
    <StyledStack
      flexDirection={direction}
      flexGrow={grow}
      flexShrink={shrink}
      flexWrap={wrap}
      {...restProps}
    />
  )
}
