import type { TreeNode } from '@development-framework/dm-core'
import type { AxiosResponse } from 'axios'
import { createSyntheticFileDownload } from '../utils'

export function downloadNode(node: TreeNode) {
  node.tree.dmssApi
    ._export({ pathAddress: node.getPath() }, { responseType: 'arraybuffer' })
    .then(async (response: AxiosResponse) => {
      const url = window.URL.createObjectURL(
        new File([response.data], `${node.name}.zip`, {
          type: 'application/zip',
        })
      )
      createSyntheticFileDownload(url, `${node.name}.zip`)
    })
}
