import {
  EntityView,
  FSTreeContext,
  TreeNode,
  TreeView,
} from '@development-framework/dm-core'
import { Progress } from '@equinor/eds-core-react'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import NodeRightClickMenu from './components/context-menu/NodeRightClickMenu'

export const TreeWrapper = styled.div`
  width: 25%;
  min-width: 25vw;
  padding-left: 15px;
  padding-top: 15px;
  height: 100vh;
  border-right: black solid 1px;
  border-radius: 2px;
  overflow: auto;
`

export default () => {
  const { treeNodes, loading } = useContext(FSTreeContext)
  const [selectedType, setSelectedType] = useState<string>()
  const [selectedEntity, setSelectedEntity] = useState<string>()
  const [nodeDimensions, setNodeDimensions] = useState<string | undefined>(
    undefined
  )

  return (
    <div style={{ display: 'flex' }}>
      <TreeWrapper>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Progress.Circular />
          </div>
        ) : (
          <TreeView
            nodes={treeNodes}
            onSelect={(node: TreeNode) => {
              setSelectedType(node.type)
              setSelectedEntity(node.nodeId)
              setNodeDimensions(Array.isArray(node.entity) ? '*' : undefined)
            }}
            NodeWrapper={NodeRightClickMenu}
          />
        )}
      </TreeWrapper>
      {selectedType && selectedEntity && (
        <div
          style={{
            padding: '1rem',
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
