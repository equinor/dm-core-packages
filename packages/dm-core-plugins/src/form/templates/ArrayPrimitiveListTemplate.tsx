import { list } from '@equinor/eds-icons'
import { useState } from 'react'
import PrimitiveArray from '../components/PrimitiveArray'
import { useRegistryContext } from '../context/RegistryContext'
import { TArrayTemplate, TPrimitive } from '../types'
import FormTemplate from './shared/FormTemplate'

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
      : config.showExpanded
  )

  return (
    <div className='w-fit min-w-[220px]'>
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
            uiAttribute={uiAttribute}
          />{' '}
          <FormTemplate.Header.Actions uiAttribute={uiAttribute} />
        </FormTemplate.Header>
        <FormTemplate.Content
          padding=''
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
        </FormTemplate.Content>
      </FormTemplate>
    </div>
  )
}

export default ArrayPrimitiveListTemplate
