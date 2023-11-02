import React, { useEffect, useState } from 'react'
import { Autocomplete, Button } from '@equinor/eds-core-react'
import DateRangePicker from './DateRangePicker'
import styled from 'styled-components'
import { EBlueprint, TSchedule } from '@development-framework/dm-core'

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
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`

export function CreateRecurringJob(props: {
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
      return (
        <small>Will run every sunday at {hour + ':' + minute} O'clock</small>
      )
    } else if (interval === 'Monthly') {
      return (
        <small>
          Will run on the 1st on every month at {hour + ':' + minute} O'clock
        </small>
      )
    } else if (interval === 'Daily') {
      return <small>Will run at {hour + ':' + minute} O'clock every day</small>
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
        newHour = hourStep ? `*/${hourStep}` : '*'
    }
    setSchedule(`${newMinute} ${newHour} ${dayOfMonth} ${month} ${dayOfWeek}`)
  }, [interval, hour, minute, hourStep])

  return (
    <div
      style={{
        border: '1px solid lightgray',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
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
            <Autocomplete
              options={Object.entries(EInterval).map((entry) => entry[1])}
              label={'Interval'}
              onInputChange={(label: string) => {
                const chosenIntervalType = Object.entries(EInterval)
                  .filter((l) => l.length > 0 && l[1] == label)
                  .pop()
                chosenIntervalType
                  ? setInterval(chosenIntervalType[1])
                  : setInterval(EInterval.HOURLY)
              }}
            />
          </div>
          {interval !== EInterval.HOURLY && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Autocomplete
                options={generateSelectableTimes().map(
                  (value: string) => value
                )}
                label={'Time'}
                onInputChange={(timestamp) => {
                  const [newHour, newMinute] = timestamp.split(':')
                  setMinute(newMinute)
                  setHour(newHour)
                }}
              />
            </div>
          )}
          {interval === EInterval.HOURLY && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Autocomplete
                options={[...Array(12).keys()].map((i) => i + 1)}
                label={'Hour step'}
                onInputChange={(step) => setHourStep(step)}
              />
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
          disabled={!schedule}
          onClick={() => {
            setCronJob({
              type: EBlueprint.CRON_JOB,
              cron: schedule ?? '* * * * *',
              startDate: dateRange.startDate,
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
