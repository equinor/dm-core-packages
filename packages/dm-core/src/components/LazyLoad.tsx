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

  const classNames = ['flex flex-col flex-grow min-h-0 w-full']
  if (!visible) classNames.push('hidden')
  if (className) classNames.push(className)

  return (
    <Element
      className={classNames.join(' ')}
      role={role}
      style={visible ? style : {}}
    >
      {children}
    </Element>
  )
}
