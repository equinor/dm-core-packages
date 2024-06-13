import { TSchedule } from '@development-framework/dm-core'
import {
  Button,
  NativeSelect,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import { ChangeEvent, useState } from 'react'
import { Message, Stack } from '../common'
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

  const intervalDescriptions = {
    Weekly: `Will run every sunday at ${cronValues.hour}:${cronValues.minute} UTC - cron:`,
    Monthly: `Will run on the 1st on every month at ${cronValues.hour}:${cronValues.minute} UTC - cron:`,
    Daily: `Will run at ${cronValues.hour}:${cronValues.minute} UTC every day
    - cron:`,
    Hourly: `Will run every ${cronValues.hourStep} hour - cron:`,
  }

  return (
    <Stack spacing={0.5}>
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
      <Stack spacing={0.5}>
        <Stack direction='row' spacing={0.5} alignItems='flex-end'>
          {showAdvanced ? (
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
            />
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
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </Button>
        </Stack>
        {showAdvanced ? (
          <Stack spacing={0.5}>
            <Typography
              group='input'
              variant='helper'
              style={{ paddingLeft: '0.5rem' }}
            >
              minute hour day(month) month day(week)
            </Typography>
            <Message type='warning' compact>
              Controls might not show correct values after manually entering
              cron syntax
            </Message>
          </Stack>
        ) : (
          <Typography group='input' variant='helper'>
            {intervalDescriptions[cronValues.interval]}
            <code> {schedule.cron}</code>
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
