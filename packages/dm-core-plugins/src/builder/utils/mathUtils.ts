/**
 * Small, dependency-free numeric helpers used by the builder's data widgets
 * (the Metric widget and the Chart's axis scaling). Kept pure so they are easy
 * to unit test and reuse.
 */

/** Parse free-form text into a list of finite numbers, ignoring non-numbers. */
export const parseNumbers = (text: string): number[] => {
  const matches = text.match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g)
  if (!matches) return []
  return matches.map(Number).filter((value) => Number.isFinite(value))
}

export const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0)

export const mean = (values: number[]): number =>
  values.length === 0 ? 0 : sum(values) / values.length

export const min = (values: number[]): number =>
  values.length === 0 ? 0 : Math.min(...values)

export const max = (values: number[]): number =>
  values.length === 0 ? 0 : Math.max(...values)

export const median = (values: number[]): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

/** Population standard deviation (matches the SIMPOS report behaviour). */
export const stddev = (values: number[]): number => {
  if (values.length === 0) return 0
  const avg = mean(values)
  const variance = mean(values.map((value) => (value - avg) ** 2))
  return Math.sqrt(variance)
}

export type TAggregation =
  | 'sum'
  | 'mean'
  | 'min'
  | 'max'
  | 'median'
  | 'stddev'
  | 'count'

const AGGREGATIONS: Record<TAggregation, (values: number[]) => number> = {
  sum,
  mean,
  min,
  max,
  median,
  stddev,
  count: (values) => values.length,
}

/** Reduce a list of numbers to a single value using the named aggregation. */
export const aggregate = (
  values: number[],
  aggregation: TAggregation
): number => (AGGREGATIONS[aggregation] ?? mean)(values)

/** Round to a fixed number of decimals and drop trailing zeros. */
export const formatNumber = (value: number, decimals = 2): string => {
  if (!Number.isFinite(value)) return '–'
  const rounded = Number(value.toFixed(Math.max(0, Math.min(10, decimals))))
  return String(rounded)
}
