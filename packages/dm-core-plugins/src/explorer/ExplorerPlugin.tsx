import {
  EBlueprint,
  EntityView,
  FSTreeContext,
  Tree,
  TreeNode,
  TreeView,
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
  const [selectedType, setSelectedType] = useState<string>()
  const [selectedEntity, setSelectedEntity] = useState<string>()
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
              setSelectedEntity(node.nodeId)
              setNodeDimensions(Array.isArray(node.entity) ? '*' : undefined)
            }}
            NodeWrapper={NodeRightClickMenu}
          />
        </Sidebar>
      )}
      {selectedType && selectedEntity && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
          }}
        >
          <EntityView
            type={selectedType}
            idReference={selectedEntity}
            dimensions={nodeDimensions}
          />
        </div>
      )}
    </div>
  )
}
