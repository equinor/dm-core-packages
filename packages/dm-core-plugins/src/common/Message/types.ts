import {
  type IconData,
  check_circle_outlined,
  error_outlined,
  info_circle,
  warning_outlined,
} from '@equinor/eds-icons'

export type MessageTypes = 'success' | 'error' | 'info' | 'warning'

export interface MessageProps {
  children?: React.ReactNode
  dismissButtonContent?: 'icon' | string | React.ReactNode
  iconPosition?: 'start' | 'end' | 'none'
  onDismiss?: () => void
  type?: MessageTypes
  compact?: boolean
}

export const ICON_TYPES: { [key in MessageTypes]: IconData } = {
  success: check_circle_outlined,
  error: error_outlined,
  warning: warning_outlined,
  info: info_circle,
}
