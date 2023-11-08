import {
  EntityView,
  FSTreeContext,
  TreeNode,
  TreeView,
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'
import Sidebar from './components/Sidebar'
import NodeRightClickMenu from './components/context-menu/NodeRightClickMenu'
import { Progress } from '@equinor/eds-core-react'

export default () => {
  const { treeNodes, loading } = useContext(FSTreeContext)
  const [selectedType, setSelectedType] = useState<string>()
  const [selectedEntity, setSelectedEntity] = useState<string>()
  const [nodeDimensions, setNodeDimensions] = useState<string | undefined>(
    undefined
  )
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Progress.Circular />
        </div>
      ) : (
        <Sidebar>
          <TreeView
            nodes={treeNodes}
            onSelect={(node: TreeNode) => {
              setSelectedType(node.type)
              setSelectedEntity(node.nodeId)
              setNodeDimensions(Array.isArray(node.entity) ? '*' : undefined)
            }}
            NodeWrapper={NodeRightClickMenu}
          />
        </Sidebar>
      )}
      {selectedType && selectedEntity && (
        <div style={{ width: '100%' }}>
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
