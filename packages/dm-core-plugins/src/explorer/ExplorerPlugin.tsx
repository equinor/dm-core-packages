import {
  EntityView,
  FSTreeContext,
  TreeNode,
  TreeView,
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import NodeRightClickMenu from './components/context-menu/NodeRightClickMenu'
import { Progress } from '@equinor/eds-core-react'

export const TreeWrapper = styled.div`
  min-width: 10vw;
  padding-left: 15px;
  padding-top: 15px;
  height: 100vh;
  border-right: black solid 1px;
  border-radius: 2px;
  overflow: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default () => {
  const { treeNodes, loading } = useContext(FSTreeContext)
  const [selectedType, setSelectedType] = useState<string>()
  const [selectedEntity, setSelectedEntity] = useState<string>()
  const [nodeDimensions, setNodeDimensions] = useState<string | undefined>(
    undefined
  )
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
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
