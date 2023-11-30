import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { zeroPad } from './calendarUtils'
import { DateTime } from 'luxon'

interface TimefieldProps {
  datetime: DateTime
  setDateTime: Dispatch<SetStateAction<DateTime>>
  useMinutes?: boolean
}

export const Timefield = (props: TimefieldProps): ReactElement => {
  const { useMinutes, datetime, setDateTime } = props

  function handleEnterTime(newTime: string | number): void {
    const [h, m] = String(newTime).split(':')
    if (Number(h) <= 23 && Number(h) >= 0) {
      if (useMinutes) {
        setDateTime(
          datetime.set({
            hour: Number(h),
            minute: Number(m),
            second: 0,
            millisecond: 0,
          })
        )
      } else {
        setDateTime(
          datetime.set({
            hour: Number(newTime),
            minute: 0,
            second: 0,
            millisecond: 0,
          })
        )
      }
    }
  }

  return (
    <div className='flex flex-col'>
      <label className='text-sm text-gray-600' htmlFor='timeInput'>
        Time {!useMinutes && ' - only' + ' hours'}
      </label>
      <input
        id='timeInput'
        type={useMinutes ? 'time' : 'number'}
        className='border border-gray-300 rounded py-1 px-2 appearance-none'
        value={
          useMinutes
            ? datetime.toFormat('HH:mm')
            : zeroPad(Number(datetime.toFormat('HH')), 2)
        }
        max={24}
        min={0}
        onChange={(e: any) => handleEnterTime(e.target.value)}
      />
    </div>
  )
}
