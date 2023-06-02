import {
  ErrorResponse,
  TreeNode,
  DmssAPI,
} from '@development-framework/dm-core'
import { AxiosError } from 'axios'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

export const DeleteAction = async (
  node: TreeNode,
  dmssAPI: DmssAPI,
  setLoading: (isLoading: boolean) => void
) => {
  setLoading(true)
  await dmssAPI
    .documentRemove({
      reference: `${node.dataSource}/${node.pathFromRootPackage()}`,
    })
    .then(() => {
      node.remove()
      NotificationManager.success('Deleted')
    })
    .catch((error: AxiosError<ErrorResponse>) => {
      console.error(error)
      NotificationManager.error(
        error.response?.data.message,
        'Failed to delete'
      )
    })
    .finally(() => setLoading(false))
}

export const NewFolderAction = (
  node: TreeNode,
  folderName: string,
  dmssAPI: DmssAPI,
  setLoading: (isLoading: boolean) => void
) => {
  const newFolder = {
    name: folderName,
    type: 'dmss://system/SIMOS/Package',
    isRoot: false,
    content: [],
  }
  const ref = `${node.nodeId}.content`
  dmssAPI
    .documentAdd({
      reference: ref,
      document: JSON.stringify(newFolder),
      updateUncontained: true,
    })
    .then(() => node.expand())
    .catch((error: AxiosError<ErrorResponse>) => {
      console.error(error)
      NotificationManager.error(error.response?.data.message)
    })
}
export const NewRootPackageAction = (
  node: TreeNode,
  packageName: string,
  dmssAPI: DmssAPI,
  setLoading: (isLoading: boolean) => void
) => {
  const newPackage = {
    name: packageName,
    type: 'dmss://system/SIMOS/Package',
    isRoot: true,
    content: [],
  }
  const ref: string = node.dataSource
  dmssAPI
    .documentAdd({
      reference: ref,
      document: JSON.stringify(newPackage),
      updateUncontained: true,
    })
    .then(() => {
      node.expand()
    })
    .catch((error: AxiosError<ErrorResponse>) => {
      NotificationManager.error(
        JSON.stringify(error.response?.data.message),
        'Failed to create new root package'
      )
    })
}
