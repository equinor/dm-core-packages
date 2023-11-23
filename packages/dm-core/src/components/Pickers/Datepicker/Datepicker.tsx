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

interface DatepickerProps {
  type: 'date' | 'datetime'
  value: Date
  setValue: Dispatch<SetStateAction<Date>>
}

export const Datepicker = (props: DatepickerProps): ReactElement => {
  const { type, value: selectedDate, setValue: setSelectedDate } = props
  const [open, setOpen] = useState(false)
  const datepickerRef = useRef<any | null>(null)
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target)
      ) {
        open && setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [datepickerRef.current])

  function handleDateInput(dateInput: string): void {
    if (dateInput.length > 0) setSelectedDate(new Date(dateInput))
  }

  return (
    <div className="relative">
      <InputWrapper
        labelProps={{
          label: type === 'datetime' ? 'Date & Time' : 'Date',
        }}
      >
        <input
          type={type === 'datetime' ? 'datetime-local' : 'date'}
          value={selectedDate.toISOString().slice(0, 16)}
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
          style={{ zIndex: 9999 }}
        >
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          {type === 'datetime' && <p>time selector</p>}
        </div>
      )}
    </div>
  )
}
