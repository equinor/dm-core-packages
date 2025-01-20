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
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Stack } from '../common'
import { DataGrid } from './DataGrid'
import { type DataGridConfig, defaultConfig } from './types'
import {
  getCalculatedDimensions,
  parseDataBeforeSave,
  reverseData,
} from './utils'

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
  const { fieldNames } = config
  const multiplePrimitives = fieldNames?.length > 1
  const attribute: TAttribute = useMemo(
    () =>
      blueprint?.attributes?.find(
        (attr: TAttribute) => attr.name === fieldNames[0]
      ),
    [blueprint, fieldNames]
  )
  const dimensions = useMemo(
    () => getCalculatedDimensions(config, attribute),
    [config, attribute]
  )

  useMemo(() => {
    if (isLoading || !document) return
    let modifiedData = document?.[fieldNames[0]] || []
    if (multiplePrimitives) {
      const mergedData: string[] = []
      fieldNames.forEach((field) => mergedData.push(document[field]))
      modifiedData = mergedData
    }
    if (config.printDirection === 'vertical') {
      modifiedData = reverseData(modifiedData, dimensions)
    }
    setData(modifiedData)
    setInitialData(window.structuredClone(modifiedData))
  }, [document, isLoading])

  function onDataChange(data: any[]) {
    setData(data)
    setIsDirty(true)
  }

  function updateForm() {
    if (onChange) onChange(parseDataBeforeSave(data, config, dimensions))
    setIsDirty(false)
  }

  async function saveDocument() {
    setLoading(true)
    try {
      const dataToSave = parseDataBeforeSave(data, config, dimensions)
      const payload = { ...document, ...dataToSave }
      await dmssAPI.documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(payload),
      })
      toast.success('Updated document!')
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

  return !data ? null : (
    <div className='dm-plugin-padding'>
      <Stack fullWidth alignItems='flex-start' spacing={1} scrollX>
        <DataGrid
          attributeType={attribute?.attributeType || 'string'}
          config={config}
          data={data || []}
          description={document?.description}
          dimensions={dimensions}
          initialRowsPerPage={config.rowsPerPage}
          name={blueprint?.name}
          setData={onDataChange}
          title={document?.title}
        />
        {config.editable && (
          <Stack direction='row' spacing={1}>
            <Tooltip title={isDirty ? 'Undo changes' : ''}>
              <Button
                onClick={() => {
                  setData(window.structuredClone(initialData))
                  setIsDirty(false)
                }}
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
