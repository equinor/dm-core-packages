import { list } from '@equinor/eds-icons'
import { useState } from 'react'
import { useRegistryContext } from '../../../../context/RegistryContext'
import { ComplexAttributeTemplate } from '../../../../templates'
import { TArrayTemplate, TPrimitive } from '../../../../types'
import { PrimitiveArray } from './PrimitiveArray/PrimitiveArray'

export const ArrayPrimitiveListTemplate = (
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
      : !!config.showExpanded
  )

  return (
    <ComplexAttributeTemplate>
      <ComplexAttributeTemplate.Header>
        <ComplexAttributeTemplate.Header.Title
          canExpand={true}
          canOpen={false}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          attribute={attribute}
          objectIsNotEmpty={true}
          icon={list}
          uiAttribute={uiAttribute}
        />
        <ComplexAttributeTemplate.Header.Actions uiAttribute={uiAttribute} />
      </ComplexAttributeTemplate.Header>
      <ComplexAttributeTemplate.Content
        id={`${namePath}-content`}
        padding='0'
        expanded={!!isExpanded}
        canExpand={true}
      >
        <PrimitiveArray
          uiAttribute={uiAttribute}
          data={value}
          namePath={namePath}
          attribute={attribute}
          onChange={onChange}
        />
      </ComplexAttributeTemplate.Content>
    </ComplexAttributeTemplate>
  )
}
