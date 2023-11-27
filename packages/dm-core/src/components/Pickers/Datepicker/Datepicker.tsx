import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { InputWrapper } from '@equinor/eds-core-react'
import { Calendar } from './Calendar'
import { Timefield } from './Timefield'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { DateTime } from 'luxon'

interface DatepickerProps {
  variant: 'date' | 'datetime'
  value: Date
  setValue: Dispatch<SetStateAction<Date>>
  useMinutes?: boolean
}

export const Datepicker = (props: DatepickerProps): ReactElement => {
  const {
    variant,
    value: selectedDate,
    setValue: setSelectedDate,
    useMinutes,
  } = props
  // TODO: Change the default state of this
  const [open, setOpen] = useState(true)
  const datepickerRef = useRef<any | null>(null)
  const [datetime, setDatetime] = useState(
    DateTime.fromJSDate(selectedDate).toUTC()
  )

  useEffect(() => {
    console.log('datetime: ', datetime.toISO())

    setSelectedDate(datetime.toJSDate())
    // if (variant === 'datetime') {
    //   setSelectedDate(datetime.toISO())
    // } else {
    //   setSelectedDate(datetime.toISODate())
    // }
  }, [datetime])

  useClickOutside(datepickerRef, () => {
    open && setOpen(false)
  })

  useEffect(() => {
    console.log(datetime)
  }, [datetime])

  function handleDateInput(dateInput: string): void {
    if (dateInput.length > 0) setSelectedDate(new Date(dateInput))
  }

  return (
    <div className="relative">
      <InputWrapper
        labelProps={{
          label: variant === 'datetime' ? 'Date & Time' : 'Date',
        }}
      >
        <input
          type={variant === 'datetime' ? 'datetime-local' : 'date'}
          value={datetime.toISO()?.slice(0, 16)}
          onClick={() => setOpen(!open)}
          onChange={(e) => handleDateInput(e.target.value)}
          onFocus={() => (open ? setOpen(true) : null)}
          className="h-9 px-2 border-b border-black bg-gray-200"
        />
      </InputWrapper>
      {open && (
        <div
          ref={datepickerRef}
          className="absolute p-4 gap-3 bg-white shadow border border-gray-300 flex flex-col rounded-sm mt-1"
          style={{ zIndex: 9999, width: '25rem' }}
        >
          <Calendar dateTime={datetime} setDatetime={setDatetime} />
          <div className="w-full h-px bg-gray-300"></div>
          {variant === 'datetime' && (
            <Timefield
              useMinutes={useMinutes}
              datetime={datetime}
              setDateTime={setDatetime}
            />
          )}
          <span className="text-sm text-gray-600">
            <span className="font-bold text-purple-600 bg-purple-100 py-1 px-1.5 rounded">
              Note:
            </span>{' '}
            This datepicker uses UTC timing
          </span>
        </div>
      )}
    </div>
  )
}
