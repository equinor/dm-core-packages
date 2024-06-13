import React, { ComponentType, PropsWithChildren, useRef } from 'react'

type LazyProps = {
  visible: boolean
  role?: string
  element?: ComponentType
  className?: string
  style?: React.CSSProperties
}

export const LazyLoad = ({
  visible,
  children,
  role,
  element,
  className,
  style,
}: PropsWithChildren<LazyProps>) => {
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
      role={role}
      className={className}
    >
      {children}
    </Element>
  )
}
