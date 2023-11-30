/**
 * Helper component
 * Wrap child with component passed as wrapper if condition is true, only return child if condition is false
 */
export function ConditionalWrapper(props: {
  children: React.ReactNode
  condition: boolean
  wrapper: any
}): React.ReactNode {
  const { condition, wrapper, children } = props
  return condition ? wrapper(children) : children
}
