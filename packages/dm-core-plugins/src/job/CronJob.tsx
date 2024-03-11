import { TSchedule } from '@development-framework/dm-core'
import {
  Button,
  NativeSelect,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
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
          Will run every sunday at {cronValues.hour + ':' + cronValues.minute}
          {' UTC'} - cron: <code>{schedule.cron}</code>
        </small>
      )
    } else if (cronValues.interval === 'Monthly') {
      return (
        <small>
          Will run on the 1st on every month at{' '}
          {cronValues.hour + ':' + cronValues.minute} UTC - cron:{' '}
          <code>{schedule.cron}</code>
        </small>
      )
    } else if (cronValues.interval === 'Daily') {
      return (
        <small>
          Will run at {cronValues.hour + ':' + cronValues.minute} UTC every day
          - cron: <code>{schedule.cron}</code>
        </small>
      )
    } else if (cronValues.interval === 'Hourly') {
      return (
        <small>
          Will run every {cronValues.hourStep} hour - cron:{' '}
          <code>{schedule.cron}</code>
        </small>
      )
    }
  }

  return (
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
            <small
              style={{ color: `${tokens.colors.interactive.danger__text.hex}` }}
            >
              Controls might not show correct values after manually entering
              cron syntax
            </small>
          </div>
        ) : (
          <>
            <NativeSelect
              id={'interval'}
              label={'Interval'}
              style={{ maxWidth: '200px' }}
              value={cronValues.interval}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const chosenIntervalType = Object.entries(EInterval)
                  .filter((l) => l.length > 0 && l[1] === e.target.value)
                  .pop()
                setCronValues({
                  ...cronValues,
                  interval: chosenIntervalType
                    ? chosenIntervalType[1]
                    : EInterval.HOURLY,
                })
              }}
            >
              {Object.values(EInterval).map((interval: string) => (
                <option key={interval}>{interval}</option>
              ))}
            </NativeSelect>
            {cronValues.interval !== EInterval.HOURLY && (
              <NativeSelect
                id={'time'}
                style={{ maxWidth: '200px' }}
                label={'Time'}
                value={`${cronValues.hour}:${cronValues.minute}`}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const [newHour, newMinute] = e.target.value.split(':')
                  setCronValues({
                    ...cronValues,
                    minute: newMinute,
                    hour: newHour,
                  })
                }}
              >
                {generateSelectableTimes().map((value: string) => (
                  <option key={value}>{value}</option>
                ))}
              </NativeSelect>
            )}
            {cronValues.interval === EInterval.HOURLY && (
              <NativeSelect
                id={'hour step'}
                style={{ maxWidth: '200px' }}
                value={Number(cronValues.hourStep)}
                label={'Hour step'}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCronValues({ ...cronValues, hourStep: e.target.value })
                }
              >
                {[...Array(12).keys()].map((i) => (
                  <option key={i}>{i + 1} </option>
                ))}
              </NativeSelect>
            )}
          </>
        )}
        <Button
          onClick={() => {
            setShowAdvanced(!showAdvanced)
            if (showAdvanced) setCronValues(defaultCronValues())
          }}
          variant='ghost'
          style={{
            alignSelf: 'flex-start',
            marginTop: `${showAdvanced ? '20px' : '15px'}`,
          }}
          className={showAdvanced ? 'self-center -translate-y-1' : ''}
        >
          {showAdvanced ? 'Simple' : 'Advanced'}
        </Button>
      </InputWrapper>
      {!showAdvanced && <div>{getLabel()}</div>}
    </div>
  )
}
