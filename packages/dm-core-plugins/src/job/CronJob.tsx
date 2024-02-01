import { TSchedule } from '@development-framework/dm-core'
import {
  Autocomplete,
  Button,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import DateRangePicker from './DateRangePicker'
import { EInterval, TCronValues } from './common'
import { defaultCronValues } from './templateEntities'

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
  column-gap: 0.5rem;
  padding-top: 1rem;
`

export function ConfigureSchedule(props: {
  isRegistered: boolean
  setCronValues: (s: TCronValues) => void
  cronValues: TCronValues
  setSchedule: (s: TSchedule) => void
  schedule: TSchedule
  readOnly: boolean // TODO: Implement this
}) {
  const { setCronValues, cronValues, isRegistered, schedule, setSchedule } =
    props
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  const getLabel = () => {
    if (cronValues.interval === 'Weekly') {
      return (
        <small>
          Will run every sunday at {cronValues.hour + ':' + cronValues.minute}{' '}
          O'clock. cron: <code>{schedule.cron}</code>
        </small>
      )
    } else if (cronValues.interval === 'Monthly') {
      return (
        <small>
          Will run on the 1st on every month at{' '}
          {cronValues.hour + ':' + cronValues.minute} O'clock. cron:{' '}
          <code>{schedule.cron}</code>
        </small>
      )
    } else if (cronValues.interval === 'Daily') {
      return (
        <small>
          Will run at {cronValues.hour + ':' + cronValues.minute} O'clock every
          day. cron: <code>{schedule.cron}</code>
        </small>
      )
    } else if (cronValues.interval === 'Hourly') {
      return (
        <small>
          Will run every {cronValues.hourStep} hour. cron:{' '}
          <code>{schedule.cron}</code>
        </small>
      )
    }
  }

  return (
    <div
      style={{
        border: '1px solid lightgray',
        borderRadius: '.4rem',
        padding: '1rem',
        maxWidth: '800px',
      }}
    >
      <div>
        {isRegistered && (
          <Typography color='primary'>The job is scheduled</Typography>
        )}
        <DateRangePicker
          setDateRange={(dateRange) =>
            setSchedule({
              ...schedule,
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            })
          }
          value={{ startDate: schedule.startDate, endDate: schedule.endDate }}
        />
        <InputWrapper>
          {showAdvanced ? (
            <div className={'flex-col'}>
              <TextField
                style={{ maxWidth: '400px' }}
                unit='cron'
                id='advanced-schedule-syntax'
                type='text'
                defaultValue={schedule.cron}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSchedule({
                    ...schedule,
                    cron: event?.target.value,
                  })
                }
                label='Enter explicit cron syntax'
                helperText='minute hour day(month) month day(week)'
              />
              <small style={{ color: 'red' }}>
                {' '}
                Controls might not show correct values after manually entering
                cron syntax
              </small>
            </div>
          ) : (
            <>
              <Autocomplete
                options={Object.values(EInterval)}
                label={'Interval'}
                style={{ maxWidth: '200px' }}
                initialSelectedOptions={[cronValues.interval]}
                onInputChange={(label: string) => {
                  const chosenIntervalType = Object.entries(EInterval)
                    .filter((l) => l.length > 0 && l[1] === label)
                    .pop()
                  setCronValues({
                    ...cronValues,
                    interval: chosenIntervalType
                      ? chosenIntervalType[1]
                      : EInterval.HOURLY,
                  })
                }}
              />
              {cronValues.interval !== EInterval.HOURLY && (
                <Autocomplete
                  style={{ maxWidth: '200px' }}
                  options={generateSelectableTimes().map(
                    (value: string) => value
                  )}
                  label={'Time'}
                  initialSelectedOptions={[
                    `${cronValues.hour}:${cronValues.minute}`,
                  ]}
                  onInputChange={(timestamp) => {
                    const [newHour, newMinute] = timestamp.split(':')
                    setCronValues({
                      ...cronValues,
                      minute: newMinute,
                      hour: newHour,
                    })
                  }}
                />
              )}
              {cronValues.interval === EInterval.HOURLY && (
                <Autocomplete
                  style={{ maxWidth: '200px' }}
                  options={[...Array(12).keys()].map((i) => i + 1)}
                  initialSelectedOptions={[Number(cronValues.hourStep)]}
                  label={'Hour step'}
                  onInputChange={(step) =>
                    setCronValues({ ...cronValues, hourStep: step })
                  }
                />
              )}
            </>
          )}
          <Button
            onClick={() => {
              setShowAdvanced(!showAdvanced)
              if (showAdvanced) setCronValues(defaultCronValues())
            }}
            variant='ghost'
            className={showAdvanced ? 'self-center -translate-y-1' : 'self-end'}
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </Button>
        </InputWrapper>
      </div>
      {!showAdvanced && (
        <div style={{ paddingTop: '.5rem', height: '1rem' }}>{getLabel()}</div>
      )}
    </div>
  )
}
