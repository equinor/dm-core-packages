import { DateTime } from 'luxon'
import { Datepicker } from '../common/Datepicker'

const DateRangePicker = (props: {
  setDateRange: (dateRange: { startDate: string; endDate: string }) => void
  value: any
}): React.ReactElement => {
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
        label='From'
      />
      <Datepicker
        id='cron-job-end-date'
        variant='date'
        value={
          value.endDate ||
          DateTime.now().startOf('day').plus({ year: 1 }).toISO()
        }
        onChange={(date: string) => setDateRange({ ...value, endDate: date })}
        label='To'
      />
    </div>
  )
}

export default DateRangePicker
