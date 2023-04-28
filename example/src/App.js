import {
  EntityView,
  FSTreeContext,
  TreeView,
} from '@development-framework/dm-core'
import { useContext, useState } from 'react'

function App() {
  const { treeNodes, loading } = useContext(FSTreeContext)
  const [selectedType, setSelectedType] = useState()
  const [selectedEntity, setSelectedEntity] = useState()

  if (loading) return <>Loading</>

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
