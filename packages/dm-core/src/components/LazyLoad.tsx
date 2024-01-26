import { ComponentType, PropsWithChildren, useRef } from 'react'

type LazyProps = {
  visible: boolean
  role?: string
  element?: ComponentType
}

export const LazyLoad = ({
  visible,
  children,
  role,
  element,
}: PropsWithChildren<LazyProps>) => {
  const rendered = useRef(visible)

  if (visible && !rendered.current) {
    rendered.current = true
  }

  if (!rendered.current) return null

  const Element = element || 'div'

  return (
    <Element
      className={`${visible ? '' : 'hidden'} w-full h-full flex`}
      role={role}
    >
      {children}
    </Element>
  )
}
