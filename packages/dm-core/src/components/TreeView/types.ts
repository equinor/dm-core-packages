import { TreeNode } from '../../domain/Tree'

export type TNodeWrapperProps = {
  node: TreeNode
  setNodeOpen: (x: boolean) => void
  children: any
}
