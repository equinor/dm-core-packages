import {
  EntityView,
  FSTreeContext,
  JsonView,
  NewEntityButton,
  TreeView,
  useDMSS,
} from '@development-framework/dm-core'
import { useContext, useState } from 'react'

import { Jobs } from './test_components/Jobs'

function App() {
  const dmssAPI = useDMSS()

  const { treeNodes, loading } = useContext(FSTreeContext)

  const [createdEntity, setCreatedEntity] = useState({})
  const [selectedType, setSelectedType] = useState()
  const [selectedEntity, setSelectedEntity] = useState()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '50px',
        justifyContent: 'space-evenly',
        overflow: 'auto',
      }}
    >
      <h3>Browse examples</h3>
      <div
        style={{
          border: '2px solid blue',
          backgroundColor: 'whitesmoke',
          width: '600px',
        }}
      >
        {loading ? (
          <>Loading...</>
        ) : (
          <TreeView
            nodes={treeNodes}
            onSelect={(node) => {
              setSelectedType(node.type)
              setSelectedEntity(node.nodeId)
            }}
          />
        )}
      </div>
      {selectedType && selectedEntity && (
        <EntityView
          type={selectedType}
          idReference={selectedEntity}
          key={selectedEntity}
        />
      )}
      <h3>Example on using jobs</h3>
      <Jobs />
      <h3>NewEntityButton button from dm-core</h3>
      <NewEntityButton
        type={'dmss://system/SIMOS/NamedEntity'}
        defaultDestination={'DemoDataSource/DemoPackage'}
        onCreated={(createdEntity) =>
          dmssAPI
            .documentGetById({
              idReference: `DemoDataSource/${createdEntity._id}`,
            })
            .then((response) => {
              setCreatedEntity(response.data)
            })
        }
      />
      {Object.entries(createdEntity).length !== 0 && (
        <>
          <h3>Created entity:</h3>
          <JsonView data={createdEntity} />
        </>
      )}
    </div>
  )
}

export default App
