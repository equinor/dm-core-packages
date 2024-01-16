import {
  IUIPlugin,
  Stack,
  TAttribute,
  TGenericObject,
  useBlueprint,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import { useEffect, useState } from 'react'
import { DataGrid } from './DataGrid'
import { DataGridConfig, defaultConfig } from './types'
import { getFunctionalityVariables, reverseData } from './utils'

export function DataGridPlugin(props: IUIPlugin) {
  const { idReference, config: userConfig, type } = props
  const config: DataGridConfig = { ...defaultConfig, ...userConfig }
  const dmssAPI = useDMSS()
  const [data, setData] = useState<any[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const { blueprint } = useBlueprint(type)
  const { document, isLoading, error } = useDocument<TGenericObject>(
    idReference,
    1
  )
  const { fieldNames, rowsPerPage } = config
  const multiplePrimitives = fieldNames?.length > 1
  const attribute = blueprint?.attributes?.find(
    (atts: TAttribute) => atts.name === fieldNames[0]
  )
  const attributes = fieldNames.map((field) =>
    blueprint?.attributes.find((att: TAttribute) => att.name === field)
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
        : parseInt(functionality.columnDimensions, 10)
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
  }, [document, isLoading])

  function onChange(data: any[]) {
    setData(data)
    setIsDirty(true)
  }

  async function saveDocument() {
    setLoading(true)
    try {
      let modifiedData = data
      if (config.printDirection === 'vertical') {
        modifiedData = reverseData(data || [], getColumnsLength(data || []))
      }
      let dataToSave = { [fieldNames[0]]: modifiedData }
      if (multiplePrimitives) {
        dataToSave = Object.fromEntries(
          (modifiedData || []).map((value, index) => [fieldNames[index], value])
        )
      }
      const payload = { ...document, ...dataToSave }
      await dmssAPI.documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(payload),
      })
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
    <Stack alignItems='flex-end' spacing={1}>
      <DataGrid
        attributeType={attribute?.attributeType || 'string'}
        config={userConfig}
        data={data || []}
        description={document?.description}
        dimensions={getDimensions()}
        initialRowsPerPage={rowsPerPage}
        name={blueprint?.name}
        setData={onChange}
        title={document?.title}
      />
      {config.editable && (
        <Button onClick={saveDocument} disabled={!isDirty || loading}>
          Save
        </Button>
      )}
    </Stack>
  )
}
