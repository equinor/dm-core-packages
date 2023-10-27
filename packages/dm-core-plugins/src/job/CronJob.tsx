import React, { useEffect, useState } from 'react'
import { Button, Label } from '@equinor/eds-core-react'
import { StyledSelect } from './Input'
import DateRangePicker from './DateRangePicker'
import styled from 'styled-components'
import { TSchedule } from '@development-framework/dm-core'

enum EInterval {
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

// Creates a list like ["00:00",...,"24:00"]
function generateSelectableTimes(): string[] {
  const selectableTimes = []
  for (let i = 0; i < 25; i++) {
    selectableTimes.push(`${i}:00`)
  }
  return selectableTimes
}

const InputWrapper = styled.div`
  flex-direction: row;
  display: flex;
  column-gap: 10px;
  padding-top: 20px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 30px;
  margin-top: 30px;
`

export function CreateReoccurringJob(props: {
  close: () => void
  removeJob: () => void
  // TODO: Export TCronJob from dm-core
  setCronJob: (job: TSchedule) => void
  cronJob?: TSchedule | undefined
}) {
  const { close, removeJob, setCronJob, cronJob } = props
  const [schedule, setSchedule] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    startDate: string
    endDate: string
  }>({ startDate: cronJob?.startDate ?? '', endDate: cronJob?.endDate ?? '' })
  const [interval, setInterval] = useState<EInterval>(EInterval.HOURLY)
  const [hour, setHour] = useState<string>('23')
  const [hourStep, setHourStep] = useState<string>('1')
  const [minute, setMinute] = useState<string>('30')

  const getLabel = () => {
    if (interval === 'Weekly') {
      return <small>Will run on sunday in every week</small>
    } else if (interval === 'Monthly') {
      return <small>Will run on the 1st on every month</small>
    } else if (interval === 'Hourly') {
      return <small>Will run every {hourStep} hour</small>
    }
  }

  useEffect(() => {
    const newMinute = minute
    let newHour = hour
    let dayOfMonth = '*'
    const month = '*'
    let dayOfWeek = '*'

    switch (interval) {
      case EInterval.WEEKLY:
        dayOfMonth = '*'
        dayOfWeek = '6'
        break
      case EInterval.MONTHLY:
        dayOfMonth = '1'
        break
      case EInterval.HOURLY:
        newHour = `*/${hourStep}`
    }
    setSchedule(`${newMinute} ${newHour} ${dayOfMonth} ${month} ${dayOfWeek}`)
  }, [interval, hour, minute, hourStep])
  return (
    <div>
      <div>
        <div style={{ paddingBottom: '10px' }}>
          {cronJob && Object.keys(cronJob).length > 0
            ? 'A job is already scheduled. You can update it here.'
            : ''}
        </div>
        <DateRangePicker
          setDateRange={(dateRange) => setDateRange(dateRange)}
          value={dateRange}
        />
        <InputWrapper>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Label label="Interval" />
            <StyledSelect
              onChange={(e) => {
                //@ts-ignore
                // TODO fix type
                setInterval(e.target.value)
              }}
              value={interval}
            >
              {Object.entries(EInterval).map(([key, value]: any) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </StyledSelect>
          </div>
          {interval !== EInterval.HOURLY && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Label label="Time" />
              <StyledSelect
                onChange={(e) => {
                  const hourAndMinute = e.target.value
                  const [newHour, newMinute] = hourAndMinute.split(':')
                  setMinute(newMinute)
                  setHour(newHour)
                }}
              >
                {generateSelectableTimes().map((value: string, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </StyledSelect>
            </div>
          )}
          {interval === EInterval.HOURLY && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Label label="Hour step" />
              <StyledSelect
                onChange={(e) => {
                  setHourStep(e.target.value)
                }}
              >
                {/*TODO fix type error*/}
                {/*@ts-ignore*/}
                {[...Array(12).keys()].map((value: number, index) => (
                  <option key={index} value={value + 1}>
                    {value + 1}
                  </option>
                ))}
              </StyledSelect>
            </div>
          )}
        </InputWrapper>
      </div>
      <div style={{ paddingTop: '10px', height: '20px' }}>{getLabel()}</div>
      <ButtonWrapper>
        <Button
          disabled={cronJob && Object.keys(cronJob).length === 0}
          color="danger"
          variant="outlined"
          onClick={() => {
            removeJob()
            close()
          }}
        >
          Remove
        </Button>
        <Button
          onClick={() => {
            setCronJob({
              //TODO fix type error
              //@ts-ignore
              cron: schedule,
              //@ts-ignore
              startDate: dateRange.startDate,
              //@ts-ignore
              endDate: dateRange.endDate,
            })
          }}
        >
          Set
        </Button>
      </ButtonWrapper>
    </div>
  )
}
