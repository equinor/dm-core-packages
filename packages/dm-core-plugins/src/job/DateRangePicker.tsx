import React from 'react'
import { Datepicker } from '@development-framework/dm-core'

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
        variant='datetime'
        value={value.startDate}
        onChange={(date) => setDateRange({ ...value, start: date })}
        label='Valid from'
      />
      <Datepicker
        id='cron-job-end-date'
        variant='datetime'
        value={value.endDate}
        onChange={(date) => setDateRange({ ...value, end: date })}
        label='Valid to'
      />
      {/*<TextField*/}
      {/*  id='startDate'*/}
      {/*  defaultValue={value.startDate}*/}
      {/*  type='datetime-local'*/}
      {/*  onChange={(e: any) =>*/}
      {/*    setDateRange({ ...value, startDate: e.target.value })*/}
      {/*  }*/}
      {/*  label={'Valid from'}*/}
      {/*/>*/}
      {/*<TextField*/}
      {/*  id='endDate'*/}
      {/*  defaultValue={value.endDate}*/}
      {/*  type='datetime-local'*/}
      {/*  onChange={(e: any) =>*/}
      {/*    setDateRange({ ...value, endDate: e.target.value })*/}
      {/*  }*/}
      {/*  label={'Valid to'}*/}
      {/*/>*/}
    </div>
  )
}

export default DateRangePicker
