import { Icon, Typography } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'

import {
  StyledDismissButton,
  StyledMessage,
  StyledMessageContent,
} from './styles'
import { ICON_TYPES, MessageProps } from './types'

export const Message = (props: MessageProps) => {
  const {
    children,
    type = 'info',
    iconPosition = 'start',
    dismissButtonContent = 'icon',
    onDismiss,
    compact = false,
  } = props
  return (
    <StyledMessage type={type}>
      <StyledMessageContent compact={compact}>
        {iconPosition === 'start' && <Icon data={ICON_TYPES[type]} />}
        <Typography token={{ fontSize: '0.875rem', fontWeight: '500' }}>
          {children}
        </Typography>
        {iconPosition === 'end' && <Icon data={ICON_TYPES[type]} />}
      </StyledMessageContent>
      {onDismiss && (
        <StyledDismissButton
          type='button'
          aria-label={`Dismiss ${type} message`}
          messageType={type}
          onClick={onDismiss}
        >
          {dismissButtonContent === 'icon' ? (
            <Icon data={close} />
          ) : (
            dismissButtonContent
          )}
        </StyledDismissButton>
      )}
    </StyledMessage>
  )
}
