import {
  type IUIPlugin,
  type TAttribute,
  type TGenericObject,
  useApplication,
  useBlueprint,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Icon, Tooltip } from '@equinor/eds-core-react'
import { undo } from '@equinor/eds-icons'
import { useEffect, useState } from 'react'
import { Stack } from '../common'
import { DataGrid } from './DataGrid'
import { type DataGridConfig, defaultConfig } from './types'
import { getFunctionalityVariables, reverseData } from './utils'

export function DataGridPlugin(props: IUIPlugin) {
  const { idReference, config: userConfig, type, onChange } = props
  const config: DataGridConfig = { ...defaultConfig, ...userConfig }
  const { dmssAPI } = useApplication()
  const [data, setData] = useState<any[]>()
  const [initialData, setInitialData] = useState<any[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const { blueprint } = useBlueprint(type)
  const { document, isLoading } = useDocument<TGenericObject>(idReference, 1)
  const { fieldNames, rowsPerPage } = config
  const multiplePrimitives = fieldNames?.length > 1
  const attribute = blueprint?.attributes?.find(
    (atts: TAttribute) => atts.name === fieldNames[0]
  )

  function getColumnsLength(data: any[]) {
    const dimensions = multiplePrimitives
      ? `*,${fieldNames.length}`
      : attribute?.dimensions
    const functionality = getFunctionalityVariables(config, dimensions)
    const columnLength = functionality.isMultiDimensional
      ? functionality.columnDimensions === '*'
        ? data.length > 0
          ? data[0].length
          : 0
        : Number.parseInt(functionality.columnDimensions, 10)
      : 1
    return columnLength
  }

  useEffect(() => {
    if (isLoading || !document) return
    let modifiedData = document?.[fieldNames[0]] || []
    if (multiplePrimitives) {
      const mergedData: string[] = []
      fieldNames.forEach((field) => mergedData.push(document[field]))
      modifiedData = mergedData
    }
    if (config.printDirection === 'vertical') {
      modifiedData = reverseData(modifiedData, getColumnsLength(modifiedData))
    }
    setData(modifiedData)
    setInitialData(window.structuredClone(modifiedData))
  }, [document, isLoading])

  function onDataChange(data: any[]) {
    setData(data)
    setIsDirty(true)
  }

  function revertChanges() {
    setData(window.structuredClone(initialData))
    setIsDirty(false)
  }

  function parseDataBeforeSave() {
    let modifiedData = data
    if (config.printDirection === 'vertical') {
      modifiedData = reverseData(data || [], getColumnsLength(data || []))
    }
    let dataToSave = { [fieldNames[0]]: modifiedData }
    if (multiplePrimitives && data?.length) {
      dataToSave = Object.fromEntries(
        (modifiedData || []).map((value, index) => [fieldNames[index], value])
      )
    }
    return dataToSave
  }

  function updateForm() {
    if (onChange) onChange(parseDataBeforeSave())
    setIsDirty(false)
  }

  async function saveDocument() {
    setLoading(true)
    try {
      const dataToSave = parseDataBeforeSave()
      const payload = { ...document, ...dataToSave }
      await dmssAPI.documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(payload),
      })
      setInitialData(window.structuredClone(data))
      setIsDirty(false)
    } catch (error) {
      throw new Error(
        error.response?.data || { message: error.name, data: error }
      )
    } finally {
      setLoading(false)
    }
  }

  function getDimensions() {
    if (multiplePrimitives) {
      return config.printDirection === 'vertical'
        ? `${fieldNames.length},*`
        : `*,${fieldNames.length}`
    }
    if (config.printDirection === 'vertical') {
      const reversed = attribute?.dimensions.split('').reverse().join('')
      return reversed
    }
    return attribute?.dimensions
  }

  return !data ? null : (
    <div className='dm-plugin-padding'>
      <Stack fullWidth alignItems='flex-start' spacing={1} scrollX>
        <DataGrid
          attributeType={attribute?.attributeType || 'string'}
          config={userConfig}
          data={data || []}
          description={document?.description}
          dimensions={getDimensions()}
          isDirty={isDirty}
          initialRowsPerPage={rowsPerPage}
          name={blueprint?.name}
          setData={onDataChange}
          title={document?.title}
        />
        {config.editable && (
          <Stack direction='row' spacing={1}>
            <Tooltip title={isDirty ? 'Undo changes' : ''}>
              <Button
                onClick={revertChanges}
                disabled={!isDirty}
                variant='outlined'
                style={{ overflow: 'hidden' }}
              >
                <Icon data={undo} size={16} />
              </Button>
            </Tooltip>
            <Button
              onClick={onChange ? updateForm : saveDocument}
              disabled={!isDirty || loading}
              style={{ overflow: 'hidden' }}
            >
              {onChange ? 'Update' : 'Save'}
            </Button>
          </Stack>
        )}
      </Stack>
    </div>
  )
}
