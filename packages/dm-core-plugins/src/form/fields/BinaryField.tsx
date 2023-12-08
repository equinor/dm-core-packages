import {
  ErrorResponse,
  splitAddress,
  TGenericObject,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Label } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import { TField } from '../types'
import { getDisplayLabelWithOptional } from '../utils/getDisplayLabel'

const getTarget = (initialValue: any) => {
  const { idReference } = useRegistryContext()
  if (initialValue['address'].includes('blob')) {
    const address = initialValue['address'].replace('blob://', '')
    const split = splitAddress(address)
    return [split.dataSource, split.documentPath]
  } else {
    return [splitAddress(idReference).dataSource, initialValue['address']]
  }
}

const DownloadBinary = (props: {
  fileId: string
  namePath: string
  displayLabel: string
  initialValue: TGenericObject & { address: string }
}) => {
  const { namePath, initialValue, displayLabel } = props
  const dmssAPI = useDMSS()
  const [data_source_id, blob_id] = getTarget(initialValue)

  const handleDownload = () => {
    dmssAPI
      .blobGetById({
        dataSourceId: data_source_id,
        blobId: blob_id,
      })
      .then((response: AxiosResponse) => {
        const data = response.data
        const blob = new Blob([data], { type: 'application/pdf' })
        const fileURL = window.URL.createObjectURL(blob)
        // Setting various property values
        const alink = document.createElement('a')
        alink.href = fileURL
        alink.download = 'SamplePDF.pdf'
        alink.click()
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
      })
  }

  return (
    <div>
      <Label label={displayLabel} />
      <Button
        namePath={namePath}
        label={displayLabel}
        onClick={() => handleDownload()}
      >
        Open
      </Button>
    </div>
  )
}

export const BinaryField = (props: TField) => {
  const { namePath, attribute } = props
  const { getValues } = useFormContext()

  const fileId = getValues(namePath.split('.').slice(-1).join('.'))
  const initialValue = getValues(namePath)

  return (
    <>
      {initialValue?.address !== undefined && (
        <DownloadBinary
          {...props}
          fileId={fileId}
          displayLabel={getDisplayLabelWithOptional(attribute)}
          initialValue={initialValue}
        />
      )}
    </>
  )
}
