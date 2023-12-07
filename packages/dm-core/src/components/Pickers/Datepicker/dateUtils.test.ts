import {
  extractDateComponents,
  formatDate,
  formatTime,
  isValidTime,
} from './datepickerUtils'

test('time is formatted correctly', () => {
  expect(formatTime('1234', true)).toBe('12:34')
  expect(formatTime('1:23', true)).toBe('01:23')
  expect(formatTime('12:34', true)).toBe('12:34')
})

test('dates are extracted', () => {
  expect(extractDateComponents('01012023')).toStrictEqual({
    day: 1,
    month: 1,
    year: 2023,
    max: 8,
  })
  expect(extractDateComponents('01/01/2023')).toStrictEqual({
    day: 1,
    month: 1,
    year: 2023,
    max: 10,
  })
})

test('format date', () => {
  expect(formatDate('')).toBe('dd/mm/yyyy')
  expect(formatDate('01012023')).toBe('01/01/2023')
  expect(formatDate('1/1/2023')).toBe('01/01/2023')
})

test('is valid time', () => {
  expect(isValidTime('12:23')).toBe(true)
  expect(isValidTime('1:34')).toBe(true)
  expect(isValidTime('34:23')).toBe(false)
})
