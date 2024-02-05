import {
  EBlueprint,
  EntityView,
  FSTreeContext,
  Tree,
  TreeNode,
  TreeView,
  useApplication,
} from '@development-framework/dm-core'
import { Progress } from '@equinor/eds-core-react'
import { useContext, useState } from 'react'
import Sidebar from './components/Sidebar'
import NodeRightClickMenu from './components/context-menu/NodeRightClickMenu'

export default () => {
  const { treeNodes, loading } = useContext<{
    tree: null | Tree
    treeNodes: TreeNode[]
    loading: boolean
  }>(FSTreeContext)
  const { setSelectedEntity } = useApplication()
  const [selectedType, setSelectedType] = useState<string>()
  const [referenceId, setReferenceId] = useState<string>('')
  const [nodeDimensions, setNodeDimensions] = useState<string | undefined>(
    undefined
  )

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Progress.Circular />
        </div>
      ) : (
        <Sidebar>
          <TreeView
            nodes={treeNodes}
            onSelect={(node: TreeNode) => {
              if (node.type === EBlueprint.PACKAGE) return
              setSelectedType(node.type)
              setSelectedEntity(node.entity)
              setReferenceId(node.nodeId)
              setNodeDimensions(Array.isArray(node.entity) ? '*' : undefined)
            }}
            NodeWrapper={NodeRightClickMenu}
          />
        </Sidebar>
      )}
      {selectedType && referenceId && (
        <div
          style={{
            height: '100%',
            display: 'flex',
            overflow: 'auto',
            flexGrow: '1',
          }}
        >
          <EntityView
            type={selectedType}
            idReference={referenceId}
            dimensions={nodeDimensions}
          />
        </div>
      )}
    </div>
  )
}
