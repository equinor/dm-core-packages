import React, { ReactNode, useEffect, useRef, useState } from 'react'

const [minWidth, maxWidth, defaultWidth] = [200, 500, 250]

type TProps = {
  children: ReactNode
}

export default function Sidebar(props: TProps) {
  const { children } = props
  const [width, setWidth] = useState<number>(
    parseInt(String(localStorage.getItem('explorerWidth'))) ?? defaultWidth
  )
  const isResized = useRef<boolean>(false)

  useEffect(() => {
    localStorage.setItem('explorerWidth', String(width))
  }, [width])

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      if (!isResized.current) {
        return
      }

      setWidth((previousWidth: number) => {
        const newWidth = previousWidth + e.movementX / 2
        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth
        return isWidthInRange ? newWidth : previousWidth
      })
    })

    window.addEventListener('mouseup', () => {
      isResized.current = false
    })
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: `${width / 16}rem`, overflow: 'hidden' }}>
        {children}
      </div>

      {/* Handle */}
      <div
        style={{
          width: '.1rem',
          backgroundColor: 'gray',
          cursor: 'col-resize',
        }}
        onMouseDown={() => {
          isResized.current = true
        }}
      />
    </div>
  )
}
