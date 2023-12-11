import { TArrayTemplate } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import TooltipButton from '../../common/TooltipButton'
import { add, list } from '@equinor/eds-icons'
import FormObjectBorder from './shared/FormObjectBorder'
import ObjectLegendWrapper from './shared/ObjectLegendWrapper'
import ObjectLegendHeader from './shared/ObjectLegendHeader'
import FormExpandedViewWrapper from './shared/FormExpandedViewWrapper'
import ObjectLegendActionsWrapper from './shared/ObjectLegendActionsWrapper'
import PrimitiveArray from './shared/PrimitiveArray'

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
    <FormObjectBorder>
      <ObjectLegendWrapper>
        <ObjectLegendHeader
          canExpand={true}
          canOpenInTab={false}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          attribute={attribute}
          objectIsNotEmpty={true}
          icon={list}
        />
      </ObjectLegendWrapper>
      {isExpanded && (
        <FormExpandedViewWrapper>
          <PrimitiveArray
            uiAttribute={uiAttribute}
            data={value}
            namePath={namePath}
            attribute={attribute}
            onChange={onChange}
          />
        </FormExpandedViewWrapper>
      )}
    </FormObjectBorder>
  )
}
