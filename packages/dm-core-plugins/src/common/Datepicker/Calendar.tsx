import {
  Button,
  EdsProvider,
  Icon,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import {
  calendar_today,
  chevron_down,
  chevron_left,
  chevron_right,
  chevron_up,
} from '@equinor/eds-icons'
import { DateTime } from 'luxon'
import { ReactElement, useEffect, useState } from 'react'
import { Stack } from '../Stack/Stack'
import {
  CALENDAR_MONTHS,
  DateSelection,
  THIS_MONTH,
  THIS_YEAR,
  calendar,
  getNextMonth,
  getPreviousMonth,
  isDateInDatelist,
  isSameDay,
  isSameMonth,
} from './calendarUtils'
import { OptionsGrid, StyledOptionButton } from './styles'

interface CalendarProps {
  dateTime: DateTime | null
  handleDateSelection: (selection: DateSelection) => void
  highlightedDates?: Date[]
  onChangeMonthView?: (year: number, month: number) => void
}

export const Calendar = (props: CalendarProps): ReactElement => {
  const { dateTime, handleDateSelection } = props
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [activeMonth, setActiveMonth] = useState<number>(
    dateTime?.month ?? THIS_MONTH
  )
  const [activeYear, setActiveYear] = useState<number>(
    dateTime?.year ?? THIS_YEAR
  )
  const cal = calendar(activeMonth, activeYear)

  const currentMonthName = Object.keys(CALENDAR_MONTHS)[activeMonth - 1]

  useEffect(() => {
    props.onChangeMonthView?.(activeYear, activeMonth)
  }, [activeMonth, activeYear])

  function incrementMonth(): void {
    const nextMonth = getNextMonth(activeMonth, activeYear)
    setActiveMonth(nextMonth.month)
    setActiveYear(nextMonth.year)
  }

  function decrementMonth(): void {
    const prevMonth = getPreviousMonth(activeMonth, activeYear)
    setActiveMonth(prevMonth.month)
    setActiveYear(prevMonth.year)
  }

  function goToToday(): void {
    const now = DateTime.now()
    handleDateSelection({ day: now.day, month: now.month, year: now.year })
    setActiveMonth(THIS_MONTH)
    setActiveYear(THIS_YEAR)
  }

  return (
    <Stack fullWidth spacing={0.75} style={{ minWidth: '320px' }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Button
          variant='ghost'
          onClick={() => setShowMonthPicker(!showMonthPicker)}
        >
          {currentMonthName} {activeYear}
          <Icon data={showMonthPicker ? chevron_up : chevron_down} />
        </Button>
        <EdsProvider density='compact'>
          <Stack direction='row'>
            <Button
              variant='ghost_icon'
              onClick={() => decrementMonth()}
              aria-label='Previous month'
            >
              <Icon data={chevron_left} />
            </Button>
            <Button
              variant='ghost_icon'
              onClick={() => goToToday()}
              aria-label='Go to today'
            >
              <Icon data={calendar_today} size={16} />
            </Button>
            <Button
              variant='ghost_icon'
              onClick={() => incrementMonth()}
              aria-label='Next month'
            >
              <Icon data={chevron_right} />
            </Button>
          </Stack>
        </EdsProvider>
      </Stack>
      {showMonthPicker ? (
        <>
          <div>
            <Typography htmlFor='datepicker-year' group='input' variant='label'>
              Year
            </Typography>
            <TextField
              id='datepicker-year'
              type='number'
              value={activeYear}
              onChange={(event: any) =>
                setActiveYear(Number(event.target.value))
              }
            />
          </div>
          <div role='radiogroup' aria-labelledby='datepicker-month-label'>
            <Typography
              id='datepicker-month-label'
              group='input'
              variant='label'
            >
              Month
            </Typography>
            <OptionsGrid>
              {Object.keys(CALENDAR_MONTHS).map((month, index) => (
                <StyledOptionButton
                  key={month}
                  variant='ghost'
                  role='radio'
                  aria-checked={index + 1 === activeMonth}
                  selected={index + 1 === activeMonth}
                  onClick={() => {
                    setActiveMonth(index + 1)
                    setShowMonthPicker(false)
                  }}
                >
                  {month}
                </StyledOptionButton>
              ))}
            </OptionsGrid>
          </div>
        </>
      ) : (
        <OptionsGrid columns={7}>
          {cal.map((date, index) => {
            const isHighlighted = isDateInDatelist(
              DateTime.fromObject(date).toJSDate(),
              props.highlightedDates
            )
            const isSelected = isSameDay(
              DateTime.fromObject(date).toJSDate(),
              dateTime ? dateTime.toJSDate() : DateTime.now().toJSDate()
            )
            return (
              <StyledOptionButton
                type='button'
                variant='ghost_icon'
                onClick={() => handleDateSelection(date)}
                aria-label={`${date.day}. ${
                  Object.keys(CALENDAR_MONTHS)[date.month - 1]
                }`}
                selected={isSelected}
                highlighted={isHighlighted}
                lessVisible={
                  !isSameMonth(
                    DateTime.fromObject(date).toJSDate(),
                    DateTime.fromObject({
                      year: activeYear,
                      month: activeMonth,
                    }).toJSDate()
                  )
                }
                key={index}
              >
                {date.day}
              </StyledOptionButton>
            )
          })}
        </OptionsGrid>
      )}
    </Stack>
  )
}
