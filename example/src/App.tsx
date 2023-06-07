import '@development-framework/dm-core/dist/main.css'
import {
  EntityView,
  FSTreeContext,
  TreeView,
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'
import { Typography } from '@equinor/eds-core-react'

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
        <Typography variant="h3">Examples</Typography>
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
