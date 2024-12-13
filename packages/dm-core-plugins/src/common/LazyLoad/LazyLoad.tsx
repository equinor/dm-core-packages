import { type ComponentType, type PropsWithChildren, useRef } from 'react'

type LazyProps = {
  visible: boolean
  role?: string
  element?: ComponentType
  className?: string
  style?: React.CSSProperties
  'data-testid'?: string
}

export const LazyLoad = (props: PropsWithChildren<LazyProps>) => {
  const { visible, element, style } = props
  const rendered = useRef(visible)

  if (visible && !rendered.current) {
    rendered.current = true
  }

  if (!rendered.current) return null

  const Element = element || 'div'

  return (
    <Element
      style={{
        flexDirection: 'column',
        flexGrow: 1,
        minHeight: 0,
        width: '100%',
        ...style,
        display: visible ? style?.display || 'flex' : 'none',
      }}
      role={props.role}
      className={props.className}
      data-testid={props['data-testid']}
    >
      {props.children}
    </Element>
  )
}
