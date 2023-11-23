import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import {
  calendar,
  CALENDAR_MONTHS,
  getNextMonth,
  getPreviousMonth,
  isSameDay,
  isSameMonth,
  THIS_MONTH,
  THIS_YEAR,
} from './calendarUtils'
import { Icon } from '@equinor/eds-core-react'
import {
  calendar_today,
  chevron_down,
  chevron_left,
  chevron_right,
} from '@equinor/eds-icons'

interface CalendarProps {
  selectedDate: Date
  setSelectedDate: Dispatch<SetStateAction<Date>>
}

export const Calendar = (props: CalendarProps): ReactElement => {
  const { selectedDate, setSelectedDate } = props
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [activeMonth, setActiveMonth] = useState(THIS_MONTH)
  const [activeYear, setActiveYear] = useState(THIS_YEAR)
  const cal = calendar(activeMonth, activeYear)

  const currentMonthName = Object.keys(CALENDAR_MONTHS)[activeMonth - 1]

  function handleClickDate(dateArray: (string | number)[]): void {
    setSelectedDate(new Date(dateArray.join('-')))
  }

  function incrementMonth(): void {
    const nextMonth = getNextMonth(activeMonth, activeYear)
    setActiveMonth(nextMonth.month)
    setActiveYear(nextMonth.year)
  }

  function decrementMonth(): void {
    const prevMonth = getPreviousMonth(activeMonth, activeYear)
    setActiveMonth(prevMonth.month)
    setActiveYear(prevMonth.year)
  }

  function goToToday(): void {
    setSelectedDate(new Date())
    setActiveMonth(THIS_MONTH)
    setActiveYear(THIS_YEAR)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="flex group hover:text-equinor-green items-center gap-1"
        >
          {currentMonthName} {activeYear}
          <Icon
            className="group-hover:bg-equinor-green-light rounded-full transition-all duration-250"
            data={chevron_down}
          />
        </button>
        <div className="flex gap-2 justify-between items-center">
          <button
            onClick={() => decrementMonth()}
            aria-label="Previous month"
            className="flex items-center rounded-full hover:bg-equinor-green-light hover:text-equinor-green"
          >
            <Icon data={chevron_left} />
          </button>
          <button
            onClick={() => goToToday()}
            aria-label="Go to today"
            className=" p-0.5flex items-center rounded-full hover:bg-equinor-green-light hover:text-equinor-green"
          >
            <Icon data={calendar_today} size={16} />
          </button>

          <button
            onClick={() => incrementMonth()}
            aria-label="Next month"
            className="flex items-center rounded-full hover:bg-equinor-green-light hover:text-equinor-green"
          >
            <Icon data={chevron_right} />
          </button>
        </div>
      </div>
      {showMonthPicker ? (
        <div className="grid grid-cols-3 gap-2.5">
          {Object.keys(CALENDAR_MONTHS).map((month, index) => (
            <span key={index}>{month}</span>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cal.map((date, index) => (
            <button
              onClick={() => handleClickDate(date)}
              className={
                'p-1 w-8 rounded-full appearance-none hover:bg-equinor-green-light hover:text-equinor-green ' +
                (isSameDay(new Date(date.join('-')), selectedDate)
                  ? 'bg-equinor-green-light text-equinor-green font-medium'
                  : isSameMonth(
                      new Date(date.join('-')),
                      new Date(`${activeYear}-${activeMonth}-01`)
                    )
                  ? ''
                  : 'text-slate-400')
              }
              key={index}
            >
              {date[2]}
            </button>
          ))}
        </div>
      )}
      <span className="text-xs text-gray-600">
        <span className="font-bold">Note:</span> This datepicker uses UTC timing
      </span>
    </div>
  )
}
