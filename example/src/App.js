import {
  BlueprintPicker,
  JsonView,
  DmssAPI,
  FSTreeContext,
  TreeView,
  useDataSources,
  NewEntityButton,
  UIRecipesSelector,
  UIPluginSelector,
} from '@development-framework/dm-core'
import { useContext, useState } from 'react'

import { Jobs } from './test_components/Jobs'

function App() {
  const dmssAPI = new DmssAPI('')

  const { treeNodes, loading } = useContext(FSTreeContext)

  const dataSources = useDataSources(dmssAPI)
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
              console.log(node)
              setSelectedType(node.type)
              setSelectedEntity(node.nodeId)
            }}
          />
        )}
      </div>
      {selectedType && selectedEntity && (
        <UIRecipesSelector type={selectedType} idReference={selectedEntity} />
      )}
      <h3>Explorer from explorer</h3>
      <UIPluginSelector
        type={'dmss://system/SIMOS/Application'}
        absoluteDottedId={'DemoDataSource/03bf685b-edb6-40e4-8c67-62b13fefecaa'}
      />

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
