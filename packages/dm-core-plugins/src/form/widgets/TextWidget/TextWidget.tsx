import React from 'react'

import {TextField, Icon} from '@equinor/eds-core-react'

import {error_filled} from '@equinor/eds-icons'
import {TWidget} from '../../types'

Icon.add({error_filled})

const TextWidget = (props: TWidget) => {
  const {label, onChange, id, value, onClick, readOnly} = props

  const _onChange = ({
                       target: {value},
                     }: React.ChangeEvent<HTMLInputElement>) => onChange(value === '' ? '' : value)

  return <TextField id={id} onChange={_onChange} readOnly={readOnly} onClick={onClick} value={value} label={label}/>
}

export default TextWidget
