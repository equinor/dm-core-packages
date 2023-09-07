import * as React from 'react'

import {
  EBlueprint,
  IUIPlugin,
  Loading,
  TFileEntity,
  TStorageReference,
  splitAddress,
  useDocument,
} from '@development-framework/dm-core'
import { DownloadFileButton } from './DownloadFileButton'
import { UploadFileButton } from './UploadFileButton'

export const FilePlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const [fileEntity, loading, updateDocument, error] = useDocument<TFileEntity>(
    idReference,
    999
  )
  const { dataSource } = splitAddress(idReference)
  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (loading || fileEntity === null) return <Loading />
  if (fileEntity.type !== EBlueprint.FILE) return <>Error: Not File type</>

  const handleUpload = (file: File, reference: TStorageReference) => {
    // Need to remove the file extension since name has strict validation rules.
    //  TODO consider removing the fileEntity.name update altogether: renaming of an existing entity does not work in dmss
    //fileEntity.name =
    //  file.name.split('/').slice(-1).join().split('.').shift() ?? ''
    fileEntity.size = file.size
    fileEntity.filetype = file.type
    fileEntity.date = new Date().toDateString()
    fileEntity.content = reference
    updateDocument(fileEntity, false)
  }

  return (
    <>
      {fileEntity?.content && (
        <DownloadFileButton fileEntity={fileEntity} dataSourceId={dataSource} />
      )}
      {fileEntity?.content == undefined && (
        <UploadFileButton onUpload={handleUpload} dataSourceId={dataSource} />
      )}
    </>
  )
}
