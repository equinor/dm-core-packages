import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Icon, InputWrapper } from '@equinor/eds-core-react'
import { Calendar } from './Calendar'
import { Timefield } from './Timefield'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { DateTime } from 'luxon'
import { calendar } from '@equinor/eds-icons'
import { DateSelection, zeroPad } from './calendarUtils'

interface DatepickerProps {
  variant: 'date' | 'datetime'
  value: string // ISO
  setValue: Dispatch<SetStateAction<string>> // ISO
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
    DateTime.fromISO(selectedDate).toUTC()
  )
  const [fieldDateValue, setFieldDateValue] = useState(
    datetime.toFormat('dd/MM/yyyy') ?? 'dd/mm/yyyy'
  )
  const [fieldTimeValue, setFieldTimeValue] = useState(
    datetime.toFormat('HH:mm') ?? '--:--'
  )

  useEffect(() => {
    setSelectedDate(datetime.toISO() ?? '')
  }, [datetime])

  useClickOutside(datepickerRef, () => {
    open && setOpen(false)
  })

  function handleDateInput({
    dateInput,
    dateSelection,
  }: {
    dateInput?: string
    dateSelection?: DateSelection
  }): void {
    if (dateInput) {
      let day
      let month
      let year
      let max
      if (dateInput?.includes('/')) {
        max = 10
        const [d, m, y] = dateInput.split('/')
        day = Number(d)
        month = Number(m)
        year = Number(y)
      } else {
        max = 8
        day = Number(dateInput?.slice(0, 2))
        month = Number(dateInput?.slice(2, 4))
        year = Number(dateInput?.slice(4, 8))
      }
      const convertedDate = DateTime.utc(year, month, day)
      if (!convertedDate.invalidExplanation) {
        setDatetime(
          datetime.set({
            year: convertedDate.year,
            month: convertedDate.month,
            day: convertedDate.day,
          })
        )
      }
      if (dateInput.length <= max) setFieldDateValue(dateInput)
    } else if (dateSelection) {
      setDatetime(datetime.set(dateSelection))
      setFieldDateValue(
        `${dateSelection.day}/${dateSelection.month}/${dateSelection.year}`
      )
    }
  }

  function formatDate(date: string): void {
    let day
    let month
    let year
    if (date?.includes('/')) {
      const [d, m, y] = date.split('/')
      day = Number(d)
      month = Number(m)
      year = Number(y)
    } else {
      day = Number(date?.slice(0, 2))
      month = Number(date?.slice(2, 4))
      year = Number(date?.slice(4, 8))
    }
    setFieldDateValue(`${zeroPad(day, 2)}/${zeroPad(month, 2)}/${year}`)
  }

  function handleTimeInput(timeInput: string): void {
    const length = timeInput.length

    if (length > fieldTimeValue.length && length + 1 === 3) {
      if (!timeInput.includes(':')) timeInput = timeInput + ':'
    }

    if (length < 6) {
      setFieldTimeValue(timeInput)
      const [hour, minute] = timeInput.split(':')

      if (
        Number(hour) >= 0 &&
        Number(hour) <= 23 &&
        Number(minute) >= 0 &&
        Number(minute) <= 59
      ) {
        setDatetime(
          datetime.set({ hour: Number(hour), minute: Number(minute) })
        )
      }
    }
  }
  function formatTime(time: string): void {
    if (time.length === 0) setFieldTimeValue('--:--')
    if (!time.includes(':')) {
      const hour = Number(time.slice(0, 1))
      const min = Number(time.slice(2, 3))
      setFieldTimeValue(`${zeroPad(hour, 2)}:${zeroPad(min, 2)}`)
    } else {
      const [hour, min] = time.split(':')
      setFieldTimeValue(
        `${zeroPad(Number(hour), 2)}:${zeroPad(Number(min), 2)}`
      )
    }
  }

  return (
    <div className='relative'>
      <InputWrapper
        labelProps={{
          label: variant === 'datetime' ? 'Date & Time' : 'Date',
        }}
      >
        <div
          className='h-9 px-2 border-b border-black bg-gray-200 flex items-center gap-2 w-fit cursor-pointer'
          onClick={() => setOpen(!open)}
        >
          <input
            type='text'
            value={fieldDateValue}
            onChange={(e) => handleDateInput({ dateInput: e.target.value })}
            onBlur={(e) => formatDate(e.target.value)}
            onFocus={() => (open ? setOpen(true) : null)}
            className='h-full bg-transparent appearance-none w-24'
          />
          <input
            type='text'
            className='appearance-none bg-transparent h-full w-12 text-center'
            onFocus={() => (open ? setOpen(true) : null)}
            value={fieldTimeValue}
            onChange={(e: any) => handleTimeInput(e.target.value)}
            onBlur={(e) => formatTime(e.target.value)}
          />
          <Icon data={calendar} size={18} className='w-6' />
        </div>
      </InputWrapper>
      {open && (
        <div
          ref={datepickerRef}
          className='absolute p-4 gap-3 bg-white shadow border border-gray-300 flex flex-col rounded-sm mt-1'
          style={{ zIndex: 9999, width: '25rem' }}
        >
          <Calendar dateTime={datetime} handleDateInput={handleDateInput} />
          <div className='w-full h-px bg-gray-300'></div>
          {variant === 'datetime' && (
            <>
              <Timefield
                useMinutes={useMinutes}
                datetime={datetime}
                setDateTime={setDatetime}
                timeFieldValue={fieldTimeValue}
                handleTimeFieldChange={handleTimeInput}
              />
              <span className='text-sm text-gray-600'>
                <span className='font-bold text-purple-600 bg-purple-100 py-1 px-1.5 rounded'>
                  Note:
                </span>{' '}
                This datepicker uses UTC timing
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
