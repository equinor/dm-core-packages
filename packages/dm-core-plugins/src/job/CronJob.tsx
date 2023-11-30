import React, { useEffect, useState } from 'react'
import { Autocomplete } from '@equinor/eds-core-react'
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
  column-gap: 0.5rem;
  padding-top: 1rem;
`

const getIntervall = ({ cron }: { cron: string }): EInterval => {
	const [, hour, dayOfMonth, , dayOfWeek] = cron.split(' ')
	if (hour.includes('/')) return EInterval.HOURLY
	if (dayOfMonth !== '*') return EInterval.MONTHLY
	if (dayOfWeek !== '*') return EInterval.WEEKLY
	if (dayOfWeek == '*') return EInterval.DAILY
	return EInterval.DAILY
}

export function ConfigureSchedule(props: {
	isRegistered: boolean
	// TODO: Export TCronJob from dm-core
	setSchedule: (s: TSchedule) => void
	schedule: TSchedule
}) {
	const { setSchedule, schedule, isRegistered } = props
	const [interval, setInterval] = useState<EInterval>(EInterval.HOURLY)
	const [hour, setHour] = useState<string>('23')
	const [hourStep, setHourStep] = useState<string>('1')
	const [minute, setMinute] = useState<string>('30')

	const getLabel = () => {
		if (interval === 'Weekly') {
			return <small>Will run every sunday at {hour + ':' + minute} O'clock</small>
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
		setSchedule({
			...schedule,
			cron: `${newMinute} ${newHour} ${dayOfMonth} ${month} ${dayOfWeek}`,
		})
	}, [interval, hour, minute, hourStep])

	return (
		<div
			style={{
				border: '1px solid lightgray',
				borderRadius: '.4rem',
				padding: '1rem',
			}}
		>
			<div>
				{isRegistered && (
					<div style={{ paddingBottom: '10px' }}>
						A job is already scheduled. You can update it here.
					</div>
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
					<Autocomplete
						options={Object.values(EInterval)}
						label={'Interval'}
						initialSelectedOptions={[getIntervall({ cron: schedule.cron })]}
						onInputChange={(label: string) => {
							const chosenIntervalType = Object.entries(EInterval)
								.filter((l) => l.length > 0 && l[1] == label)
								.pop()
							setInterval(
								chosenIntervalType ? chosenIntervalType[1] : EInterval.HOURLY
							)
						}}
					/>
					{interval !== EInterval.HOURLY && (
						<Autocomplete
							options={generateSelectableTimes().map((value: string) => value)}
							label={'Time'}
							onInputChange={(timestamp) => {
								const [newHour, newMinute] = timestamp.split(':')
								setMinute(newMinute)
								setHour(newHour)
							}}
						/>
					)}
					{interval === EInterval.HOURLY && (
						<Autocomplete
							options={[...Array(12).keys()].map((i) => i + 1)}
							label={'Hour step'}
							onInputChange={(step) => setHourStep(step)}
						/>
					)}
				</InputWrapper>
			</div>
			<div style={{ paddingTop: '.5rem', height: '1rem' }}>{getLabel()}</div>
		</div>
	)
}
