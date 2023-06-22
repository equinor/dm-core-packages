import * as React from 'react'

import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TLinkReference,
  useDocument,
  EBlueprint,
} from '@development-framework/dm-core'
import { DownloadButton } from './DownloadFileButton'
import { UploadFileButton } from './UploadFileButton'

export const FilePlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const [fileEntity, loading, updateDocument, error] =
    useDocument<TGenericObject>(idReference, 999)
  const dataSource = idReference.split('/')[0]

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (loading || fileEntity === null) return <Loading />
  if (fileEntity['type'] !== EBlueprint.FILE) return <>Error: Not File type</>

  const handleUpload = (file: File, reference: TLinkReference) => {
    // Need to remove the file extension since name has strict validation rules.
    fileEntity['name'] = file.name
      .split('/')
      .slice(-1)
      .join()
      .split('.')
      .shift()
    fileEntity['size'] = file.size
    fileEntity['filetype'] = file.type
    fileEntity['date'] = new Date()
    fileEntity['content'] = reference
    updateDocument(fileEntity, false)
  }

  return (
    <>
      {fileEntity?.content && (
        <DownloadButton fileEntity={fileEntity} dataSourceId={dataSource} />
      )}
      {fileEntity?.content == undefined && (
        <UploadFileButton onUpload={handleUpload} />
      )}
    </>
  )
}
