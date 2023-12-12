import { TArrayTemplate, TPrimitive } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { list } from '@equinor/eds-icons'
import FormTemplate from './shared/FormTemplate'
import PrimitiveArray from '../components/PrimitiveArray'

export const ArrayPrimitiveTemplate = (
  props: TArrayTemplate & {
    value: TPrimitive[]
    onChange: (v: TPrimitive[]) => void
  }
) => {
  const { namePath, attribute, uiAttribute, value, onChange } = props

  const { config } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )

  return (
    <FormTemplate>
      <FormTemplate.Header>
        <FormTemplate.Header.Title
          canExpand={true}
          canOpen={false}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          attribute={attribute}
          objectIsNotEmpty={true}
          icon={list}
        />
      </FormTemplate.Header>
      {isExpanded && (
        <FormTemplate.Content>
          <PrimitiveArray
            uiAttribute={uiAttribute}
            data={value}
            namePath={namePath}
            attribute={attribute}
            onChange={onChange}
          />
        </FormTemplate.Content>
      )}
    </FormTemplate>
  )
}
