import { StyledStack } from './styles'
import { defaultProps, type StackProps } from './types'

export const Stack = (props: StackProps) => {
  const mergedProps = { ...defaultProps, ...props }
  return <StyledStack {...mergedProps} />
}
