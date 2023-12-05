import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Icon, InputWrapper } from '@equinor/eds-core-react'
import { Calendar } from './Calendar'
import { Timefield } from './Timefield'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { DateTime } from 'luxon'
import { calendar } from '@equinor/eds-icons'
import { DateSelection, zeroPad } from './calendarUtils'
import { extractDateComponents } from './datepickerUtils'

interface DatepickerProps {
  id: string
  readonly?: boolean
  label?: string
  variant: 'date' | 'datetime'
  value: string // ISO
  onChange: (date: string) => unknown
  useMinutes?: boolean
  helperText?: string
  isDirty?: boolean
}

export const Datepicker = (props: DatepickerProps): ReactElement => {
  const {
    variant,
    value: selectedDate,
    useMinutes,
    onChange,
    id,
    readonly,
    label,
    helperText,
    isDirty,
  } = props
  const [open, setOpen] = useState(false)
  const datepickerRef = useRef<any | null>(null)
  const [datetime, setDatetime] = useState(
    selectedDate
      ? DateTime.fromISO(selectedDate).toUTC()
      : DateTime.now().toUTC()
  )
  const [fieldDateValue, setFieldDateValue] = useState(
    datetime.toFormat('dd/MM/yyyy') ?? 'dd/mm/yyyy'
  )
  const [fieldTimeValue, setFieldTimeValue] = useState(
    datetime.toFormat('HH:mm') ?? '--:--'
  )

  useEffect(() => {
    onChange(datetime.toISO() ?? '')
  }, [datetime])

  useClickOutside(datepickerRef, () => {
    setOpen(false)
  })

  function handleDateInput(dateInput: string): void {
    if (dateInput) {
      const { day, month, year, max } = extractDateComponents(dateInput)
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
    } else setFieldDateValue(String(dateInput))
  }

  function handleDateSelection(selection: DateSelection): void {
    setDatetime(datetime.set(selection))
    setFieldDateValue(`${selection.day}/${selection.month}/${selection.year}`)
  }

  function formatDate(date: string): void {
    if (date && date !== 'dd/mm/yyyy') {
      const { day, month, year } = extractDateComponents(date)
      setFieldDateValue(`${zeroPad(day, 2)}/${zeroPad(month, 2)}/${year}`)
    } else {
      setFieldDateValue('dd/mm/yyyy')
    }
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
          datetime.set({
            hour: Number(hour),
            minute: useMinutes ? Number(minute) : 0,
          })
        )
      }
    }
  }
  function formatTime(time: string): void {
    if (time.length === 0) setFieldTimeValue('--:--')
    if (!time.includes(':')) {
      const hour = Number(time.slice(0, 1))
      const min = Number(time.slice(2, 3))
      setFieldTimeValue(
        `${zeroPad(hour, 2)}:${zeroPad(useMinutes ? min : 0, 2)}`
      )
    } else {
      const [hour, min] = time.split(':')
      setFieldTimeValue(
        `${zeroPad(Number(hour), 2)}:${zeroPad(
          Number(useMinutes ? min : 0),
          2
        )}`
      )
    }
  }

  return (
    <div className='relative'>
      <InputWrapper
        labelProps={{
          label: label
            ? label
            : variant === 'datetime'
              ? 'Date & Time'
              : 'Date',
        }}
        helperProps={{
          text: helperText,
        }}
      >
        <div
          id={id}
          className={`h-9 px-2 border-b border-black bg-gray-200 flex items-center gap-2 w-fit ${
            readonly ? '' : 'cursor-pointer'
          } ${isDirty ? 'bg-[#85babf5e]' : 'bg-[#f7f7f7]'}`}
          onClick={() => (!readonly ? setOpen(!open) : null)}
        >
          <input
            type='text'
            aria-label='Enter date'
            value={fieldDateValue}
            disabled={readonly}
            onChange={(e) => handleDateInput(e.target.value)}
            onBlur={(e) => formatDate(e.target.value)}
            onFocus={() => (open ? setOpen(true) : null)}
            className='h-full bg-transparent appearance-none w-24'
          />
          <input
            type='text'
            aria-label='Enter time'
            className='appearance-none bg-transparent h-full w-12 text-center'
            disabled={readonly}
            onFocus={() => (open ? setOpen(true) : null)}
            value={fieldTimeValue}
            onChange={(e: any) => handleTimeInput(e.target.value)}
            onBlur={(e) => formatTime(e.target.value)}
          />
          <Icon data={calendar} size={18} className='w-6 mb-1' />
        </div>
      </InputWrapper>
      {open && (
        <div
          ref={datepickerRef}
          className='absolute p-4 gap-3 bg-white shadow border border-gray-300 flex flex-col rounded-sm mt-1'
          style={{ zIndex: 9999, width: '25rem' }}
        >
          <Calendar
            dateTime={datetime}
            handleDateSelection={handleDateSelection}
          />
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
