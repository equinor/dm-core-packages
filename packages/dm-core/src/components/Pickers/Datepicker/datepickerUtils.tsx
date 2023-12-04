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
