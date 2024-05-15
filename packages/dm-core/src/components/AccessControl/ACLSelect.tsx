import React from 'react'
import { AccessLevel } from '../../services'
import { Select } from '../Select'

export const ACLSelect = ({
  value,
  handleChange,
}: {
  value: AccessLevel
  handleChange: (newValue: AccessLevel) => void
}): React.ReactElement => {
  return (
    <Select
      width={'120px'}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange(
          AccessLevel[event.target.value as keyof typeof AccessLevel]
        )
      }}
    >
      {Object.keys(AccessLevel).map((accessLevelKey) => (
        <option value={accessLevelKey} key={accessLevelKey}>
          {accessLevelKey}
        </option>
      ))}
    </Select>
  )
}
