import { ComponentType, PropsWithChildren, useRef } from 'react'

type LazyProps = {
  visible: boolean
  role?: string
  element?: ComponentType
  className?: string
}

export const LazyLoad = ({
  visible,
  children,
  role,
  element,
  className,
}: PropsWithChildren<LazyProps>) => {
  const rendered = useRef(visible)

  if (visible && !rendered.current) {
    rendered.current = true
  }

  if (!rendered.current) return null

  const Element = element || 'div'

  const classNames = ['wrapper']
  if (!visible) classNames.push('hidden')
  if (className) classNames.push(className)

  return (
    <Element className={classNames.join(' ')} role={role}>
      {children}
    </Element>
  )
}
