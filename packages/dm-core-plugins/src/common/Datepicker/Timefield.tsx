import { TextField, Typography } from '@equinor/eds-core-react'
import type { ReactElement } from 'react'

interface TimefieldProps {
  useMinutes?: boolean
  timeFieldValue: string
  handleTimeFieldChange: (time: string) => void
  formatTime: (time: string) => void
}

export const Timefield = (props: TimefieldProps): ReactElement => {
  const { useMinutes, timeFieldValue, handleTimeFieldChange, formatTime } =
    props

  return (
    <div>
      <Typography htmlFor='datepicker-time-input' group='input' variant='label'>
        Time {!useMinutes && ' - only' + ' hours'}
      </Typography>
      <TextField
        id='datepicker-time-input'
        value={timeFieldValue}
        onChange={(e: any) => handleTimeFieldChange(e.target.value)}
        onBlur={(e: any) => formatTime(e.target.value)}
        helperText='NOTE: This datepicker uses UTC timing'
      />
    </div>
  )
}
