import { CircularProgress } from '@equinor/eds-core-react'
import { useEffect, useState } from 'react'

export const Loading = () => {
  const [visibility, setVisibility] = useState<'hidden' | 'visible'>('hidden')

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibility('visible')
    }, 300)
    return () => clearInterval(interval)
  }, [])
  return (
    <div style={{ padding: '50px', visibility: visibility }}>
      <CircularProgress size={24} />
    </div>
  )
}
