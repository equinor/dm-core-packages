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
      <h3>A generic list view</h3>
      <EntityView
        type={'dmss://DemoDataSource/DemoPackage/blueprints/OrderItem'}
        idReference={'DemoDataSource/orderExample.items'}
        dimensions={'*'}
                      />
      <h3>Signal Application</h3>
      <EntityView
        type={'dmss://DemoDataSource/apps/MySignalApp/models/SignalApp'}
        idReference={'DemoDataSource/4483c9b0-d505-46c9-a157-94c79f4d7a6a'}
      />     
      <h3>An application with the "header"-plugin</h3>
      <EntityView
        type={'dmss://DemoDataSource/DemoPackage/blueprints/ExampleApplication'}
        idReference={'DemoDataSource/03bf685b-edb6-40e4-8c67-62b13fefecaa'}
      />
      <h3>TreeView from dm-core</h3>
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
