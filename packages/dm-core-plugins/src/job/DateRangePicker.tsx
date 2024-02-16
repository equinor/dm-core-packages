import { Datepicker } from '@development-framework/dm-core'
import { DateTime } from 'luxon'

const DateRangePicker = (props: {
  setDateRange: (dateRange: { startDate: string; endDate: string }) => void
  value: any
}): JSX.Element => {
  const { setDateRange, value } = props

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '.5rem',
      }}
    >
      <Datepicker
        id='cron-job-start-date'
        variant='date'
        value={value.startDate || DateTime.now().startOf('day').toISO()}
        onChange={(date: string) => setDateRange({ ...value, startDate: date })}
        label='Jobs will be scheduled from'
      />
      <Datepicker
        id='cron-job-end-date'
        variant='date'
        value={
          value.endDate ||
          DateTime.now().startOf('day').plus({ year: 1 }).toISO()
        }
        onChange={(date: string) => setDateRange({ ...value, endDate: date })}
        label='Jobs will no longer be scheduled after'
      />
    </div>
  )
}

export default DateRangePicker
