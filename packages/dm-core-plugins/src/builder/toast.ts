import { useCallback, useState } from 'react'

export type TToast = {
  /** Unique id; changing it restarts the auto-hide timer for a new message. */
  id: number
  message: string
}

export type TUseToast = {
  toast: TToast | null
  /** Show a transient message, replacing any currently visible one. */
  notify: (message: string) => void
  dismiss: () => void
}

/** Minimal single-slot toast state for transient builder feedback. */
export const useToast = (): TUseToast => {
  const [toast, setToast] = useState<TToast | null>(null)

  const notify = useCallback(
    (message: string) => setToast({ id: Date.now(), message }),
    []
  )
  const dismiss = useCallback(() => setToast(null), [])

  return { toast, notify, dismiss }
}
