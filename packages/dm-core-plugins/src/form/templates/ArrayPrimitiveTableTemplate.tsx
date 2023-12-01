import { TArrayTemplate } from '../types'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useEffect, useState } from 'react'
import { Fieldset, Legend } from '../styles'
import { Button, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import TooltipButton from '../../common/TooltipButton'
import {
  add,
  chevron_down,
  chevron_up,
  remove_outlined,
} from '@equinor/eds-icons'
import { AttributeField } from '../fields/AttributeField'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import {
  Table,
  TAttribute,
  TGenericObject,
  TTableConfig,
  TTableRowItem,
} from '@development-framework/dm-core'
import * as utils from '../../table/utils'

Icon.add({ add, chevron_down, chevron_up })

function getDefaultValue(type: string): string | boolean | number {
  switch (type) {
    case 'boolean':
      return true
    case 'number':
      return 0
    default:
      return ''
  }
}

export function createItemsFromDocument(
  attribute: TAttribute,
  document: TGenericObject | null
): TTableRowItem[] {
  const dimensions = attribute.dimensions?.split(',')
  const columns = dimensions?.map(
    (dimension: string, index: number) => `col_${index}`
  )
  return document
    ? Object.values(document)?.map((data, index) => {
        const id: string = crypto.randomUUID()
        const columnData: any = {}
        columns?.forEach(
          (column: string, index: number) =>
            (columnData[column] =
              attribute.dimensions == '*' ? data : data[index])
        )
        return {
          data: columnData,
          index,
          key: id,
          id,
        }
      })
    : []
}

export const ArrayPrimitiveTableTemplate = (
  props: TArrayTemplate & {
    value: unknown[]
    onChange: (v: unknown[]) => void
  }
) => {
  const { namePath, attribute, uiAttribute, value, onChange } = props

  const { config, idReference } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
  const [dirtyState, setDirtyState] = useState<boolean>(false)
  const [items, setItems] = useState<TTableRowItem[]>([])

  const updateValues = (
    index: number,
    newValue: boolean | string | number
  ): void => {
    const newValues = [...value]
    switch (attribute.attributeType) {
      case 'boolean':
        newValues[index] = newValue
        onChange(newValues)
        break
      case 'number':
        newValues[index] = Number(newValue) ?? 0
        onChange(newValues)
        break
      default:
        newValues[index] = newValue
        onChange(newValues)
    }
  }
  const removeItem = (index: number) => {
    const newValues = [...value]
    newValues.splice(index, 1)
    onChange(newValues)
  }

  useEffect(() => {
    if (!Array.isArray(value)) {
      throw new Error(
        `Generic table plugin cannot be used on document that is not an array! Got document ${JSON.stringify(
          value
        )}`
      )
    }
    const itemsWithIds = createItemsFromDocument(attribute, value)
    setItems(itemsWithIds)
  }, [value])

  async function saveTable(itemsList: TTableRowItem[]) {
    const payload = itemsList.map((item) => item.data)
    onChange(payload)
  }

  const columns = attribute.dimensions
    ?.split(',')
    .map((dimension: string, index: number) => {
      return { data: `col_${index}`, label: '' }
    })
  const tableConfig: TTableConfig = utils.mergeConfigs({
    columns: columns,
    variant: [
      {
        name: 'edit',
      },
    ],
  })

  console.log(items)

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        <TooltipButton
          title='Expand'
          button-variant='ghost_icon'
          button-onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? chevron_up : chevron_down}
        />
        {!config.readOnly && isExpanded && (
          <TooltipButton
            title='Add'
            button-variant='ghost_icon'
            button-onClick={() =>
              updateValues(
                value.length,
                getDefaultValue(attribute.attributeType)
              )
            }
            icon={add}
          />
        )}
      </Legend>
      {isExpanded && (
        <Table
          config={tableConfig}
          dirtyState={dirtyState}
          idReference={idReference}
          items={items}
          loadingState={false}
          onOpen={() => console.log('open')}
          saveTable={saveTable}
          setDirtyState={setDirtyState}
          setItems={setItems}
          type={attribute.attributeType}
        />
      )}
    </Fieldset>
  )
}
