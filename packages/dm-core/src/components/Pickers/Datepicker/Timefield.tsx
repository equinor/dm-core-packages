import React, { ReactElement } from 'react'

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
    <div className='flex flex-col'>
      <label className='text-sm text-gray-600' htmlFor='timeInput'>
        Time {!useMinutes && ' - only' + ' hours'}
      </label>
      <input
        id='timeInput'
        type='string'
        className='border border-gray-300 rounded py-1 px-2 appearance-none'
        value={timeFieldValue}
        onChange={(e) => handleTimeFieldChange(e.target.value)}
        onBlur={(e) => formatTime(e.target.value)}
      />
    </div>
  )
}
