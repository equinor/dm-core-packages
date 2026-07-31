import { Snackbar } from '@equinor/eds-core-react'
import type { TToast } from '../utils/toast'

/**
 * Renders the current builder toast. Keyed by toast id so a new message
 * restarts the Snackbar's auto-hide timer.
 */
export const Toast = ({
  toast,
  onClose,
}: {
  toast: TToast | null
  onClose: () => void
}): React.ReactElement | null => {
  if (!toast) return null
  return (
    <Snackbar
      key={toast.id}
      open
      autoHideDuration={3000}
      onClose={onClose}
      placement='bottom'
    >
      {toast.message}
    </Snackbar>
  )
}
