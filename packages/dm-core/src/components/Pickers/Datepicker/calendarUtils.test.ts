import {
  getMonthDays,
  getNextMonth,
  getPreviousMonth,
  isDate,
  isSameDay,
  isSameMonth,
} from './calendarUtils'
import { DateTime } from 'luxon'

test('get month days', () => {
  expect(getMonthDays(1, 2023)).toBe(31)
  expect(getMonthDays(4, 2023)).toBe(30)
  expect(getMonthDays(2, 2023)).toBe(28)
  expect(getMonthDays(2, 2020)).toBe(29)
})

test('is date', () => {
  const date = DateTime.now()
  expect(isDate(date.toJSDate())).toBe(true)
  expect(isDate(date as unknown as Date)).toBe(false)
})

test('is same month', () => {
  const today = DateTime.now()
  const tomorrow = today.plus({ day: 1 })
  expect(isSameMonth(today.toJSDate(), tomorrow.toJSDate())).toBe(true)
  expect(
    isSameMonth(today.toJSDate(), tomorrow.plus({ month: 1 }).toJSDate())
  ).toBe(false)
})

test('is same day', () => {
  const today = DateTime.now().toJSDate()
  const today2 = DateTime.now().toJSDate()
  const tomorrow = DateTime.now().plus({ day: 1 }).toJSDate()
  expect(isSameDay(today, today2)).toBe(true)
  expect(isSameDay(today, tomorrow)).toBe(false)
})

test('get next month', () => {
  expect(getNextMonth(1, 2023)).toStrictEqual({ month: 2, year: 2023 })
})
test('get previous month', () => {
  expect(getPreviousMonth(2, 2023)).toStrictEqual({ month: 1, year: 2023 })
})
