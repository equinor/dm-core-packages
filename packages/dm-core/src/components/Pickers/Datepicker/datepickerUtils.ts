import { zeroPad } from './calendarUtils'

export function extractDateComponents(dateString: string): {
  day: number
  month: number
  year: number
  max: number
} {
  let day: number
  let month: number
  let year: number
  let max: number
  if (dateString?.includes('/')) {
    const [d, m, y] = dateString.split('/')
    day = Number(d)
    month = Number(m)
    year = Number(y)
    max = 10
  } else {
    day = Number(dateString?.slice(0, 2))
    month = Number(dateString?.slice(2, 4))
    year = Number(dateString?.slice(4, 8))
    max = 8
  }
  return {
    day,
    month,
    year,
    max,
  }
}

export function formatTime(time: string, minutes?: boolean): string {
  if (time.length === 0) return '--:--'
  if (!time.includes(':')) {
    const hour = Number(time.slice(0, 2))
    const min = Number(time.slice(2, 4))
    return `${zeroPad(hour, 2)}:${zeroPad(minutes ? min : 0, 2)}`
  } else {
    const [hour, min] = time.split(':')
    return `${zeroPad(Number(hour), 2)}:${zeroPad(
      Number(minutes ? min : 0),
      2
    )}`
  }
}

export function formatDate(date: string): string {
  if (date && date !== 'dd/mm/yyyy') {
    const { day, month, year } = extractDateComponents(date)
    return `${zeroPad(day, 2)}/${zeroPad(month, 2)}/${year}`
  } else {
    return 'dd/mm/yyyy'
  }
}

export function isValidTime(time: string): boolean {
  const [hour, minute] = time.split(':')
  return (
    Number(hour) >= 0 &&
    Number(hour) <= 23 &&
    Number(minute) >= 0 &&
    Number(minute) <= 59
  )
}
