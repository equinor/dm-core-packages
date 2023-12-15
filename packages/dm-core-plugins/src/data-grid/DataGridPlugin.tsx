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
import { DataGrid } from './DataGrid'
import { Button } from '@equinor/eds-core-react'

export function DataGridPlugin(props: IUIPlugin) {
  const { idReference, config, type } = props
  const dmssAPI = useDMSS()
  const [data, setData] = useState<any[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const { blueprint } = useBlueprint(type)
  const { document, isLoading, error } = useDocument<TGenericObject>(
    idReference,
    1
  )
  const { fieldName, rowsPerPage } = config
  const attribute = blueprint?.attributes?.find(
    (atts: TAttribute) => atts.name === fieldName
  )

  useEffect(() => {
    if (isLoading || !document) return
    setData(document?.[fieldName] || [])
  }, [document, isLoading])

  function onChange(data: any[]) {
    setData(data)
    setIsDirty(true)
  }

  async function saveDocument() {
    setLoading(true)
    try {
      const payload = { ...document, data }
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
        data={data || []}
        setData={onChange}
        attributeType={attribute?.attributeType || 'string'}
        dimensions={attribute?.dimensions}
        initialRowsPerPage={rowsPerPage}
      />
      <Button onClick={saveDocument} disabled={!isDirty || loading}>
        Save
      </Button>
    </Stack>
  )
}
