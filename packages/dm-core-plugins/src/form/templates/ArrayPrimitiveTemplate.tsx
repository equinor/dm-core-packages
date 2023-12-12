import { TArrayTemplate } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { list } from '@equinor/eds-icons'
import FormObject from './shared/FormObject'
import PrimitiveArray from '../components/PrimitiveArray'

export const ArrayPrimitiveTemplate = (
  props: TArrayTemplate & {
    value: unknown[]
    onChange: (v: unknown[]) => void
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
    <FormObject>
      <FormObject.Legend>
        <FormObject.Legend.Header
          canExpand={true}
          canOpen={false}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          attribute={attribute}
          objectIsNotEmpty={true}
          icon={list}
        />
      </FormObject.Legend>
      {isExpanded && (
        <FormObject.ExpandedView>
          <PrimitiveArray
            uiAttribute={uiAttribute}
            data={value}
            namePath={namePath}
            attribute={attribute}
            onChange={onChange}
          />
        </FormObject.ExpandedView>
      )}
    </FormObject>
  )
}
