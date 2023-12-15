import { TArrayTemplate, TPrimitive } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { list } from '@equinor/eds-icons'
import FormTemplate from './shared/FormTemplate'
import PrimitiveArray from '../components/PrimitiveArray'
import GhostTextButton from '../components/GhostTextButton'

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

  const multi: boolean = attribute.dimensions?.includes(',') || false
  const [definedColumns, definedRows] = attribute.dimensions?.split(',') || [
    '*,*',
  ]
  const showCreateButton = definedRows !== '*' && value.length === 0

  const getFillValue = (type: string) =>
    type === 'boolean' ? false : type === 'number' ? 0 : ''

  function createPrimitiveArray() {
    if (multi && definedRows !== '*') {
      const fillValue = getFillValue(attribute.attributeType)
      const definedRowsAmount = parseInt(definedRows, 10)
      const definedColumnsAmount = parseInt(definedColumns, 10)
      const emptyRow = Array.from({ length: definedColumnsAmount }).fill(
        fillValue
      )
      const newRows: any[] = []
      for (let i = definedRowsAmount; i > 0; i--) {
        newRows.push(emptyRow)
      }
      onChange(newRows)
    }
  }

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
        <FormTemplate.Header.Actions>
          {showCreateButton && (
            <GhostTextButton
              buttonText={'Create'}
              title={'Create'}
              tooltip={`Create new ${namePath}`}
              ariaLabel={'Create new entity'}
              onClick={createPrimitiveArray}
            />
          )}
        </FormTemplate.Header.Actions>
      </FormTemplate.Header>
      {isExpanded && !showCreateButton && (
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

export default ArrayPrimitiveListTemplate
