import { StyledStack } from './styles'
import { StackProps, defaultProps } from './types'

export const Stack = (props: StackProps) => {
  const mergedProps = { ...defaultProps, ...props }
  return <StyledStack {...mergedProps} />
}
