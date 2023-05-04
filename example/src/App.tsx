import {
  EntityView,
  FSTreeContext,
  TreeView,
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'

function App() {
  const { treeNodes, loading } = useContext(FSTreeContext)
  const [selectedType, setSelectedType] = useState<string>()
  const [selectedEntity, setSelectedEntity] = useState<string>()

  if (loading) return <div>Loading</div>

  return (
    <div
      style={{
        display: 'flex',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          width: '500px',
        }}
      >
        <h3>Examples</h3>
        <TreeView
          nodes={treeNodes}
          onSelect={(node) => {
            setSelectedType(node.type)
            setSelectedEntity(node.nodeId)
          }}
        />
      </div>
      <div
        style={{
          padding: '20px',
          width: '100%',
        }}
      >
        {selectedType && selectedEntity && (
          <EntityView
            type={selectedType}
            idReference={selectedEntity}
            key={selectedEntity}
          />
        )}
      </div>
    </div>
  )
}

export default App
