import {
  Loading,
  type TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import type React from 'react'
import { useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Stack } from '../common'
import {
  type CounterPluginProps,
  defaultConfig,
  type TCounterEntitySettings,
} from './types'

/**
 * Component which renders a numeric attribute with increment/decrement buttons.
 *
 * @docs Plugins
 * @scope CounterPlugin
 *
 * @param {TCounterPluginConfig} props {@link TCounterPluginConfig}
 */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const SpinButton = styled(Button)`
  &:hover {
    animation: ${spin} 0.8s linear infinite;
  }
`

const jump = keyframes`
  0%   { transform: translateY(0); }
  25%  { transform: translateY(1px); }
  50%  { transform: translateY(2px); }
  75%  { transform: translateY(-14px); }
  100% { transform: translateY(0); }
`

const JumpButton = styled(Button)<{ $jumping: boolean }>`
  ${({ $jumping }) =>
    $jumping &&
    css`
      animation: ${jump} var(--jump-speed, 0.8s) ease-in infinite;
    `}
`

type TCounterDocument = TGenericObject & TCounterEntitySettings

export const CounterPlugin = (props: CounterPluginProps) => {
  const { idReference, config: userConfig } = props
  const { document, isLoading, error, updateDocument } =
    useDocument<TCounterDocument>(idReference, 1)
  const config = { ...defaultConfig, ...userConfig, ...document }

  const [jumpDuration, setJumpDuration] = useState(0.8)
  const [isJumping, setIsJumping] = useState(false)
  const jumpInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const startJumping = () => {
    setIsJumping(true)
    jumpInterval.current = setInterval(() => {
      setJumpDuration((d) => Math.max(0.1, +(d - 0.05).toFixed(2)))
    }, 300)
  }

  const resetSpeed = () => {
    if (jumpInterval.current) clearInterval(jumpInterval.current)
    setJumpDuration(0.8)
    jumpInterval.current = setInterval(() => {
      setJumpDuration((d) => Math.max(0.1, +(d - 0.05).toFixed(2)))
    }, 500)
  }

  const resetJumping = () => {
    if (jumpInterval.current) clearInterval(jumpInterval.current)
    setIsJumping(false)
    setJumpDuration(0.8)
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading || !document) return <Loading />

  const value: number = Number(
    document[config.attribute] ?? config.initialValue
  )

  const setValue = (next: number) =>
    updateDocument({ ...document, [config.attribute]: next }, false, true)

  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={1}
      className='dm-plugin-padding'
    >
      <Typography variant='h5' style={{ color: config.color }}>
        {config.label}
      </Typography>
      <JumpButton
        $jumping={isJumping}
        style={{ '--jump-speed': `${jumpDuration}s` } as React.CSSProperties}
        variant='outlined'
        onMouseEnter={startJumping}
        onMouseLeave={resetJumping}
        onClick={() => {
          resetSpeed()
          setValue(value - config.decrementValue)
        }}
      >
        -
      </JumpButton>
      <Typography data-testid='counter-value' style={{ color: config.color }}>
        {value}
      </Typography>
      <SpinButton
        variant='outlined'
        onClick={() => setValue(value + config.incrementValue)}
      >
        +
      </SpinButton>
    </Stack>
  )
}
