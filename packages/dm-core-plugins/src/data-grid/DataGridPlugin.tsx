import React, { useState, useEffect } from 'react'
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
import { DataGridConfig, defaultConfig } from './types'
import { DataGrid } from './DataGrid'

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

  useEffect(() => {
    if (isLoading || !document) return
    if (multiplePrimitives) {
      const mergedData: string[] = []
      fieldNames.forEach((field) => mergedData.push(document[field]))
      setData(mergedData)
      return
    }
    setData(document?.[fieldNames[0]] || [])
  }, [document, isLoading])

  function onChange(data: any[]) {
    setData(data)
    setIsDirty(true)
  }

  async function saveDocument() {
    setLoading(true)
    try {
      let newData = { [fieldNames[0]]: data }
      if (multiplePrimitives) {
        newData = Object.fromEntries(
          (data || []).map((value, index) => [fieldNames[index], value])
        )
      }
      const payload = { ...document, ...newData }
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

  return !data ? null : (
    <Stack alignItems='flex-end' spacing={1}>
      <DataGrid
        attributeType={attribute?.attributeType || 'string'}
        config={userConfig}
        data={data || []}
        description={document?.description}
        dimensions={
          multiplePrimitives ? `*,${fieldNames.length}` : attribute?.dimensions
        }
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
