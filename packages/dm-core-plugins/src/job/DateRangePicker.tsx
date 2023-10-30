import React from 'react'
import { TextField } from '@equinor/eds-core-react'

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
      }}
    >
      <TextField
        id="startDate"
        defaultValue={value.startDate}
        type="datetime-local"
        onChange={(e: any) =>
          setDateRange({ ...value, startDate: e.target.value })
        }
        label={'Valid from'}
      />
      <TextField
        id="endDate"
        defaultValue={value.endDate}
        type="datetime-local"
        onChange={(e: any) =>
          setDateRange({ ...value, endDate: e.target.value })
        }
        label={'Valid to'}
      />
    </div>
  )
}

export default DateRangePicker
