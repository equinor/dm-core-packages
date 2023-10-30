import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '@development-framework/dm-core'

const [minWidth, maxWidth, defaultWidth] = [200, 500, 250]

type TProps = {
  children: ReactNode
}

export default function Sidebar(props: TProps) {
  const { children } = props
  const sideBarWidth = useLocalStorage('explorerWidth', defaultWidth)
  const [width, setWidth] = useState<number>(
    parseInt(String(sideBarWidth)) ?? defaultWidth
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
          width: '.3rem',
          borderRight: '.1rem solid gray',
          cursor: 'col-resize',
        }}
        onMouseDown={() => {
          isResized.current = true
        }}
      />
    </div>
  )
}
