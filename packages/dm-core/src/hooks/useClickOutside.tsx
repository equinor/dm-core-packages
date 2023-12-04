import { MutableRefObject, useEffect } from 'react'

export function useClickOutside(
  elementRef: MutableRefObject<HTMLElement>,
  callback: () => any
): any {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as HTMLElement)
      ) {
        callback()
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [elementRef])
}
