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
import { DateTime } from 'luxon'

interface CalendarProps {
  dateTime: DateTime
  setDatetime: Dispatch<SetStateAction<DateTime>>
}

export const Calendar = (props: CalendarProps): ReactElement => {
  const { dateTime, setDatetime } = props
  // TODO: Change default to false
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [activeMonth, setActiveMonth] = useState(THIS_MONTH)
  const [activeYear, setActiveYear] = useState(THIS_YEAR)
  const cal = calendar(activeMonth, activeYear)

  const currentMonthName = Object.keys(CALENDAR_MONTHS)[activeMonth - 1]

  function handleClickDate(dateArray: {
    year: number
    month: number
    day: number
  }): void {
    setDatetime(dateTime.set(dateArray))
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
    setDatetime(DateTime.now())
    setActiveMonth(THIS_MONTH)
    setActiveYear(THIS_YEAR)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="flex group hover:text-equinor-green items-center gap-1"
        >
          {currentMonthName} {activeYear}
          <Icon
            className={
              'group-hover:bg-equinor-green-light rounded-full transition-all duration-250 ' +
              (showMonthPicker ? 'rotate-180' : '')
            }
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
        <>
          <div className="flex flex-col mb-3">
            <span className="text-sm text-gray-600">Year</span>
            <input
              className="border border-gray-300 rounded px-2 py-1"
              type="number"
              value={activeYear}
              onChange={(event) => setActiveYear(Number(event.target.value))}
            />
          </div>
          <div className="">
            <span className="text-sm text-gray-600">Month</span>
            <div className="grid grid-cols-3 gap-2.5 rounded py-2">
              {Object.keys(CALENDAR_MONTHS).map((month, index) => (
                <button
                  onClick={() => setActiveMonth(index + 1)}
                  className={
                    'hover:bg-equinor-green-light hover:text-equinor-green px-2 rounded py-1 ' +
                    (index + 1 === activeMonth
                      ? 'bg-equinor-green-light text-equinor-green'
                      : '')
                  }
                  key={index}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cal.map((date, index) => (
            <button
              onClick={() => handleClickDate(date)}
              className={
                'p-1.5 w-9 rounded-full appearance-none hover:bg-equinor-green-light hover:text-equinor-green ' +
                (isSameDay(
                  DateTime.fromObject(date).toUTC().toJSDate(),
                  dateTime.toJSDate()
                )
                  ? 'bg-equinor-green-light text-equinor-green font-medium'
                  : isSameMonth(
                      DateTime.fromObject(date).toJSDate(),
                      DateTime.fromObject({
                        year: activeYear,
                        month: activeMonth,
                      }).toJSDate()
                    )
                  ? ''
                  : 'text-slate-400')
              }
              key={index}
            >
              {date.day}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
