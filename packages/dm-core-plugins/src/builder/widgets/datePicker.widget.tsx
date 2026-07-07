import type { IUIPlugin } from '@development-framework/dm-core'
import { calendar } from '@equinor/eds-icons'
import { useState } from 'react'
import type { TWidgetDefinition } from './types'

/**
 * Date picker — a worked example of a self-contained widget.
 *
 * This whole file is the canonical reference for `builder/docs/ADDING_WIDGETS.md`:
 * one file that co-locates the runtime component AND its registry definition.
 * Copy it as a starting point for your own widgets.
 */

interface DatePickerConfig {
  label?: string
  /** Starting date, as `YYYY-MM-DD`. */
  value?: string
  helperText?: string
}

/** The component rendered on the published page (and in the builder preview). */
const DatePickerWidget = (
  props: Omit<IUIPlugin, 'config'> & { config: DatePickerConfig }
): React.ReactElement => {
  const { label = 'Pick a date', value = '', helperText } = props.config
  const [date, setDate] = useState(value)

  return (
    <div className='dm-plugin-padding' style={{ width: '100%' }}>
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {label}
        <input
          type='date'
          value={date}
          onChange={(event) => setDate(event.target.value)}
          style={{
            padding: '6px 8px',
            border: '1px solid #bbb',
            borderRadius: 4,
            font: 'inherit',
          }}
        />
      </label>
      {helperText ? (
        <div style={{ fontSize: 12, color: '#6f6f6f', marginTop: 4 }}>
          {helperText}
        </div>
      ) : null}
    </div>
  )
}

/** The registry definition — what makes it show up in the palette. */
export const datePickerWidget: TWidgetDefinition = {
  icon: calendar,
  load: () => Promise.resolve({ default: DatePickerWidget }),
  block: {
    id: 'date-picker',
    label: 'Date picker',
    icon: 'calendar',
    category: 'data',
    description: 'Let visitors pick a date.',
    contentModel: 'content',
    defaultSize: { columns: 4, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-date-picker',
    defaultConfig: { label: 'Pick a date' },
    hideTitle: true,
    fields: [
      {
        label: 'Label',
        type: 'text',
        target: { kind: 'config', key: 'label' },
        help: 'Caption shown above the picker.',
      },
      {
        label: 'Default date',
        type: 'text',
        target: { kind: 'config', key: 'value' },
        placeholder: '2026-07-01',
        help: 'Optional starting date (YYYY-MM-DD).',
      },
      {
        label: 'Helper text',
        type: 'text',
        target: { kind: 'config', key: 'helperText' },
        help: 'Small hint shown beneath the picker.',
      },
    ],
  },
}
