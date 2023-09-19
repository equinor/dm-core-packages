import {
  DmssAPI,
  ErrorResponse,
  TreeNode,
} from '@development-framework/dm-core'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const DeleteAction = async (
  node: TreeNode,
  dmssAPI: DmssAPI,
  setLoading: (isLoading: boolean) => void
) => {
  setLoading(true)
  await dmssAPI
    .documentRemove({
      address: `${node.dataSource}/${node.pathFromRootPackage()}`,
    })
    .then(() => {
      node.remove()
      toast.success('Deleted')
    })
    .catch((error: AxiosError<ErrorResponse>) => {
      console.error(error)
      toast.error('Failed to delete')
    })
    .finally(() => setLoading(false))
}

export const NewFolderAction = (
  node: TreeNode,
  folderName: string,
  dmssAPI: DmssAPI
) => {
  const newFolder = {
    name: folderName,
    type: 'dmss://system/SIMOS/Package',
    isRoot: false,
    content: [],
  }
  const address = `${node.nodeId}.content`
  dmssAPI
    .documentAdd({
      address: address,
      document: JSON.stringify(newFolder),
      updateUncontained: true,
    })
    .then(() => node.expand())
    .catch((error: AxiosError<ErrorResponse>) => {
      console.error(error)
      toast.error(error.response?.data.message)
    })
}
export const NewRootPackageAction = (
  node: TreeNode,
  packageName: string,
  dmssAPI: DmssAPI
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
      address: ref,
      document: JSON.stringify(newPackage),
      updateUncontained: true,
    })
    .then(() => {
      node.expand()
    })
    .catch((error: AxiosError<ErrorResponse>) => {
      console.error(error)
      toast.error('Failed to create new root package')
    })
}
