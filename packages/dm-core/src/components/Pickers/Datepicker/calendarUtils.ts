import { DateTime } from 'luxon'

export interface DateSelection {
  day: number
  month: number
  year: number
}

const now = DateTime.now()
export const THIS_YEAR: number = now.year
export const THIS_MONTH: number = now.month
export const CALENDAR_MONTHS = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
}
export const CALENDAR_WEEKS = 6
export const zeroPad = (value: number, length: number): string => {
  return `${value}`.padStart(length, '0')
}

export const getMonthDays = (
  month: number = THIS_MONTH,
  year: number = THIS_YEAR
) => {
  const months30 = [4, 6, 9, 11]
  const leapYear = year % 4 === 0
  return month === 2 ? (leapYear ? 29 : 28) : months30.includes(month) ? 30 : 31
}

export const getMonthFirstDay = (month = THIS_MONTH, year = THIS_YEAR) => {
  return new Date(`${year}-${zeroPad(month, 2)}-01`).getDay() + 1
}

export const isDate = (date: Date): boolean => {
  const isDate = Object.prototype.toString.call(date) === '[object Date]'
  const isValidDate = date && !Number.isNaN(date.valueOf())

  return isDate && isValidDate
}

export const isSameMonth = (
  date: Date,
  basedate: Date = new Date()
): boolean => {
  if (!(isDate(date) && isDate(basedate))) return false
  const basedateMonth = basedate.getMonth() + 1
  const basedateYear = basedate.getFullYear()
  const dateMonth = date.getMonth() + 1
  const dateYear = date.getFullYear()
  return basedateMonth === dateMonth && basedateYear === dateYear
}

export const isSameDay = (date: Date, basedate: Date = new Date()): boolean => {
  if (!(isDate(date) && isDate(basedate))) return false
  const baseDate = basedate.getDate()
  const baseMonth = basedate.getMonth() + 1
  const baseYear = basedate.getFullYear()
  const dateDate = date.getDate()
  const dateMonth = date.getMonth() + 1
  const dateYear = date.getFullYear()
  return (
    baseDate === dateDate && baseMonth === dateMonth && baseYear === dateYear
  )
}

export const getPreviousMonth = (month: number, year: number) => {
  const prevMonth = month > 1 ? month - 1 : 12
  const prevMonthYear = month > 1 ? year : year - 1
  return { month: prevMonth, year: prevMonthYear }
}

export const getNextMonth = (month: number, year: number) => {
  const nextMonth = month < 12 ? month + 1 : 1
  const nextMonthYear = month < 12 ? year : year + 1
  return { month: nextMonth, year: nextMonthYear }
}
// Calendar builder for a month in the specified year
// Returns an array of the calendar dates.
// Each calendar date is represented as an array => [YYYY, MM, DD]
export const calendar = (
  month: number = THIS_MONTH,
  year: number = THIS_YEAR
): DateSelection[] => {
  // Get number of days in the month and the month's first day

  const monthDays = getMonthDays(month, year)
  const monthFirstDay = getMonthFirstDay(month, year)
  // Get number of days to be displayed from previous and next months
  // These ensure a total of 42 days (6 weeks) displayed on the calendar

  const daysFromPrevMonth = monthFirstDay - 1
  const daysFromNextMonth = CALENDAR_WEEKS * 7 - (daysFromPrevMonth + monthDays)
  // Get the previous and next months and years

  const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(
    month,
    year
  )
  const { month: nextMonth, year: nextMonthYear } = getNextMonth(month, year)
  // Get number of days in previous month
  const prevMonthDays = getMonthDays(prevMonth, prevMonthYear)
  // Builds dates to be displayed from previous month

  const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
    const day = index + 1 + (prevMonthDays - daysFromPrevMonth)
    // return [ prevMonthYear, zeroPad(prevMonth, 2), zeroPad(day, 2) ]
    return { day: day, month: prevMonthDays, year: prevMonthYear }
  })
  // Builds dates to be displayed from current month

  const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
    const day = index + 1
    // return [ year, zeroPad(month, 2), zeroPad(day, 2) ]
    return { day: day, month: month, year: year }
  })
  // Builds dates to be displayed from next month

  const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
    const day = index + 1
    // return [ nextMonthYear, zeroPad(nextMonth, 2), zeroPad(day, 2) ]
    return { day: day, month: nextMonth, year: nextMonthYear }
  })
  // Combines all dates from previous, current and next months
  return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates]
}
