import {
  aggregate,
  formatNumber,
  max,
  mean,
  median,
  min,
  parseNumbers,
  stddev,
  sum,
} from './mathUtils'

describe('math utils', () => {
  it('parses finite numbers from free-form text', () => {
    expect(parseNumbers('1, 2, 3')).toEqual([1, 2, 3])
    expect(parseNumbers('1 2\n3.5\t-4')).toEqual([1, 2, 3.5, -4])
    expect(parseNumbers('a 1 b 2 c')).toEqual([1, 2])
    expect(parseNumbers('1e3 2.5e-1')).toEqual([1000, 0.25])
    expect(parseNumbers('nothing here')).toEqual([])
  })

  it('computes basic aggregations', () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(sum(values)).toBe(40)
    expect(mean(values)).toBe(5)
    expect(min(values)).toBe(2)
    expect(max(values)).toBe(9)
    expect(median(values)).toBe(4.5)
    expect(stddev(values)).toBe(2)
  })

  it('returns the middle value for odd-length medians', () => {
    expect(median([3, 1, 2])).toBe(2)
  })

  it('guards empty input with zero', () => {
    expect(sum([])).toBe(0)
    expect(mean([])).toBe(0)
    expect(min([])).toBe(0)
    expect(max([])).toBe(0)
    expect(median([])).toBe(0)
    expect(stddev([])).toBe(0)
  })

  it('dispatches aggregations by name', () => {
    const values = [1, 2, 3, 4]
    expect(aggregate(values, 'sum')).toBe(10)
    expect(aggregate(values, 'mean')).toBe(2.5)
    expect(aggregate(values, 'min')).toBe(1)
    expect(aggregate(values, 'max')).toBe(4)
    expect(aggregate(values, 'count')).toBe(4)
  })

  it('formats numbers to fixed decimals without trailing zeros', () => {
    expect(formatNumber(Math.PI, 2)).toBe('3.14')
    expect(formatNumber(5, 2)).toBe('5')
    expect(formatNumber(2.5, 0)).toBe('3')
    expect(formatNumber(Number.NaN)).toBe('–')
  })
})
