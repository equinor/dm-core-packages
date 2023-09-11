import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import {
  FSTreeContext,
  TreeView,
  EntityView,
} from '@development-framework/dm-core'
import { NodeRightClickMenu } from './components/context-menu/ContextMenu'
import './style.css'
import { Progress } from '@equinor/eds-core-react'

export const TreeWrapper = styled.div`
  width: 25%;
  min-width: 15vw;
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
            onSelect={(node) => {
              setSelectedType(node.type)
              setSelectedEntity(node.nodeId)
            }}
            NodeWrapper={NodeRightClickMenu}
          />
        )}
      </TreeWrapper>
      {selectedType && selectedEntity && (
        <EntityView type={selectedType} idReference={selectedEntity} />
      )}
    </div>
  )
}
