import {
  Button,
  EdsProvider,
  Icon,
  InputWrapper,
  Popover,
  TextField,
} from '@equinor/eds-core-react'
import { calendar } from '@equinor/eds-icons'
import { DateTime } from 'luxon'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Stack } from '../Stack/Stack'
import { Calendar } from './Calendar'
import { Timefield } from './Timefield'
import { DateSelection, zeroPad } from './calendarUtils'
import { extractDateComponents, formatTime } from './datepickerUtils'

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
  highlightedDates?: string[]
  onChangeMonthView?: (year: number, month: number) => void
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
    onChangeMonthView,
  } = props
  const [open, setOpen] = useState(false)
  const datepickerRef = useRef<HTMLDivElement | null>(null)
  const [datetime, setDatetime] = useState(() => {
    return selectedDate ? DateTime.fromISO(selectedDate) : null
  })
  const [dateFieldValue, setDateFieldValue] = useState(
    datetime?.toFormat('dd/MM/yyyy') ?? 'dd/mm/yyyy'
  )
  const [timeFieldValue, setTimeFieldValue] = useState(
    datetime?.toFormat('HH:mm') ?? '--:--'
  )
  const inputWrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!useMinutes && datetime) {
      setDatetime(datetime.set({ minute: 0, second: 0, millisecond: 0 }))
      formatTime(timeFieldValue)
    }
  }, [selectedDate])

  useEffect(() => {
    onChange(datetime?.toISO() ?? '')
  }, [datetime])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [datepickerRef])

  function handleDateInput(dateInput: string): void {
    if (dateInput) {
      const { day, month, year, max } = extractDateComponents(dateInput)
      const convertedDate = DateTime.utc(year, month, day)
      if (!convertedDate.invalidExplanation && datetime) {
        setDatetime(
          datetime?.set({
            year: convertedDate.year,
            month: convertedDate.month,
            day: convertedDate.day,
          })
        )
      }
      if (dateInput.length <= max) setDateFieldValue(dateInput)
    } else setDateFieldValue(String(dateInput))
  }

  function handleDateSelection(selection: DateSelection): void {
    setDatetime(
      datetime
        ? datetime?.set(selection)
        : DateTime.fromObject({ ...selection, hour: 12, minute: 0 })
    )
    setDateFieldValue(`${selection.day}/${selection.month}/${selection.year}`)
    if (timeFieldValue === '--:--') setTimeFieldValue('12:00')
  }

  function formatDate(date: string): void {
    if (date && date !== 'dd/mm/yyyy') {
      const { day, month, year } = extractDateComponents(date)
      setDateFieldValue(`${zeroPad(day, 2)}/${zeroPad(month, 2)}/${year}`)
    } else {
      setDateFieldValue('dd/mm/yyyy')
    }
  }

  function handleTimeInput(timeInput: string): void {
    const length = timeInput.length

    if (length > timeFieldValue.length && length + 1 === 3) {
      if (!timeInput.includes(':')) timeInput = timeInput + ':'
    }

    if (length < 6) {
      setTimeFieldValue(timeInput)
      const [hour, minute] = timeInput.split(':')

      if (
        Number(hour) >= 0 &&
        Number(hour) <= 23 &&
        Number(minute) >= 0 &&
        Number(minute) <= 59
      ) {
        if (datetime)
          setDatetime(
            datetime.set({
              hour: Number(hour),
              minute: useMinutes ? Number(minute) : 0,
            })
          )
      }
    }
  }

  return (
    <div>
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
        <Stack
          ref={inputWrapperRef}
          direction='row'
          alignItems='center'
          style={{ maxWidth: 'max-content' }}
        >
          <TextField
            id={`${id}-date-field`}
            aria-label='Enter date'
            value={dateFieldValue}
            disabled={readonly}
            onChange={(e: any) => handleDateInput(e.target.value)}
            onBlur={(e: any) => formatDate(e.target.value)}
            style={{ width: '8rem' }}
          />
          {variant === 'datetime' && (
            <TextField
              id={`${id}-time-field`}
              aria-label='Enter time'
              disabled={readonly}
              value={timeFieldValue}
              onChange={(e: any) => handleTimeInput(e.target.value)}
              onBlur={(e: any) =>
                setTimeFieldValue(formatTime(e.target.value, useMinutes))
              }
              style={{ width: '4rem' }}
            />
          )}
          <EdsProvider density='compact'>
            <Button variant='ghost_icon' onClick={() => setOpen(!open)}>
              <Icon data={calendar} size={18} color='#2e2e2e' />
            </Button>
          </EdsProvider>
        </Stack>
      </InputWrapper>
      {createPortal(
        <Popover open={open} anchorEl={inputWrapperRef.current}>
          <Stack
            id='date-picker-popover-container'
            ref={datepickerRef}
            padding={1}
            spacing={0.75}
          >
            <Calendar
              dateTime={datetime}
              handleDateSelection={handleDateSelection}
              highlightedDates={props.highlightedDates?.map((d) => new Date(d))}
              onChangeMonthView={onChangeMonthView}
            />
            {variant === 'datetime' && (
              <Timefield
                useMinutes={useMinutes}
                timeFieldValue={timeFieldValue}
                handleTimeFieldChange={handleTimeInput}
                formatTime={formatTime}
              />
            )}
          </Stack>
        </Popover>,
        document.body
      )}
    </div>
  )
}
