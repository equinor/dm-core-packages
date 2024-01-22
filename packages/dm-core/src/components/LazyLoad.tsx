import { PropsWithChildren, useRef } from 'react'

type LazyProps = {
  visible: boolean
  role?: string
}

export const LazyLoad = ({
  visible,
  children,
  role,
}: PropsWithChildren<LazyProps>) => {
  const rendered = useRef(visible)

  if (visible && !rendered.current) {
    rendered.current = true
  }

  if (!rendered.current) return null

  return (
    <div className={`${visible ? '' : 'hidden'} w-full`} role={role}>
      {children}
    </div>
  )
}
