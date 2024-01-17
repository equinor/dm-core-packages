import { CircularProgress } from '@equinor/eds-core-react'

export const Loading = () => {
  return (
    <div style={{ alignSelf: 'center', padding: '50px' }}>
      <CircularProgress />
    </div>
  )
}
