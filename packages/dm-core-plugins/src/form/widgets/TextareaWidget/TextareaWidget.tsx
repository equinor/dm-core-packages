import React from 'react'

import {TextField, Icon} from '@equinor/eds-core-react'

import {error_filled} from '@equinor/eds-icons'
import {TWidget} from '../../types'

Icon.add({error_filled})

const TextareaWidget = (props: TWidget) => {
  const {label, onChange} = props

  const _onChange = ({
                       target: {value},
                     }: React.ChangeEvent<HTMLInputElement>) => onChange(value === '' ? '' : value)

  return (
    // @ts-ignore
    <TextField
      {...props}
      multiline={true}
      rows={5}
      onChange={_onChange}
      label={label}
    />
  )
}

export default TextareaWidget
