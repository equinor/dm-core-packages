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
  const [fieldDateValue, setFieldDateValue] = useState('dd/mm/yyyy')
  const [fieldTimeValue, setFieldTimeValue] = useState('--:--')

  useEffect(() => {
    setSelectedDate(datetime.toJSDate())
  }, [datetime])

  useClickOutside(datepickerRef, () => {
    open && setOpen(false)
  })

  function handleDateInput(dateInput: string): void {
    let day, month, year
    if (dateInput.includes('/')) {
      const [d, m, y] = dateInput.split('/')
      day = Number(d)
      month = Number(m)
      year = Number(y)
    } else {
      day = Number(dateInput.slice(0, 2))
      month = Number(dateInput.slice(2, 4))
      year = Number(dateInput.slice(4, 8))
    }
    const convertedDate = DateTime.utc(year, month, day)
    if (!convertedDate.invalidExplanation)
      setDatetime(
        datetime.set({
          year: convertedDate.year,
          month: convertedDate.month,
          day: convertedDate.day,
        })
      )

    setFieldDateValue(dateInput)
  }

  function handleTimeInput(timeInput: string): void {
    const length = timeInput.length
    if (length + 1 === 3) {
      timeInput = timeInput + ':'
    }
    if (length === 0) timeInput = '--:--'
    if (length < 6) setFieldTimeValue(timeInput)

    const [hour, minute] = timeInput.split(':')
    if (
      Number(hour) >= 0 &&
      Number(hour) <= 23 &&
      Number(minute) >= 0 &&
      Number(minute) <= 59
    ) {
      console.log('setting time')
      setDatetime(datetime.set({ hour: Number(hour), minute: Number(minute) }))
    }
  }

  return (
    <div className="relative">
      <InputWrapper
        labelProps={{
          label: variant === 'datetime' ? 'Date & Time' : 'Date',
        }}
      >
        <div
          className="h-9 px-2 border-b border-black bg-gray-200 flex items-center gap-2 w-fit cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <input
            type="text"
            value={fieldDateValue}
            onChange={(e) => handleDateInput(e.target.value)}
            onFocus={() => (open ? setOpen(true) : null)}
            className="h-full bg-transparent appearance-none w-24"
          />
          <input
            type="text"
            className="appearance-none bg-transparent h-full w-12 text-center"
            onFocus={() => (open ? setOpen(true) : null)}
            value={fieldTimeValue}
            onChange={(e: any) => handleTimeInput(e.target.value)}
          />
          <Icon data={calendar} size={18} className="w-6" />
        </div>
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
            <>
              <Timefield
                useMinutes={useMinutes}
                datetime={datetime}
                setDateTime={setDatetime}
              />
              <span className="text-sm text-gray-600">
                <span className="font-bold text-purple-600 bg-purple-100 py-1 px-1.5 rounded">
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
