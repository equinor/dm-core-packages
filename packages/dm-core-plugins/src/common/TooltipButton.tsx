import { Button, EdsProvider, Icon, Tooltip } from '@equinor/eds-core-react'
import { IconData } from '@equinor/eds-icons'
import React from 'react'
import internal from 'stream'

type Prefix<T, P extends string> = {
  [K in keyof T as `${P}-${string & K}`]: T[K]
}
type PrefixedButton = Prefix<
  Omit<React.ComponentProps<typeof Button>, 'aria-label' | 'children'>,
  'button'
>
type PrefixedTooltip = Prefix<
  Omit<React.ComponentProps<typeof Tooltip>, 'title' | 'children'>,
  'tooltip'
>
type TContent =
  | {
      icon?: IconData
      buttonText: string
    }
  | {
      icon: IconData
      buttonText?: string
    }
type TProps = PrefixedButton &
  PrefixedTooltip &
  TContent & {
    title: string
    compact?: boolean
    iconSize?: 16 | 18 | 24 | 32 | 40 | 48 | undefined
  }

const getProps = (prefix: string, dict: { [k: string]: any }) => {
  return Object.fromEntries(
    Object.entries(dict)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [k.slice(prefix.length), v])
  )
}

/**
 * Tests can access the components through getByRole('button', { name: title })) or getByLabel(title)
 * @param props Component accepts all props used by EDS Button and EDS Tooltip. However, to avoid interfering with each other, you'll have to prefix the prop with "button-" or "tooltip-". Ex: button-onChange. In addition, it has a mandatory title prop, which is used both as aria-label and tooltip title. You must also supply it with a buttonText and/or an icon.
 * @returns An EDS button with EDS tooltip.
 */
const TooltipButton = (props: TProps) => {
  return (
    <EdsProvider density={props.compact ? 'compact' : 'comfortable'}>
      <Tooltip title={props.title} {...getProps('tooltip-', props)}>
        <Button {...getProps('button-', props)} aria-label={props.title}>
          {props.icon && <Icon size={props.iconSize ?? 16} data={props.icon} />}
          {props.buttonText}
        </Button>
      </Tooltip>
    </EdsProvider>
  )
}

export default TooltipButton
