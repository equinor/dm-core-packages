import {
  BlueprintPicker,
  JsonView,
  DmssAPI,
  FSTreeContext,
  TreeView,
  Loading,
  useDataSources,
  UIPluginSelector,
  NewEntityButton,
} from '@development-framework/dm-core'
import { useContext, useState } from 'react'
import { Jobs } from './test_components/Jobs'

function App() {
  const dmssAPI = new DmssAPI('')

  const { treeNodes, loading } = useContext(FSTreeContext)

  const dataSources = useDataSources(dmssAPI)
  const [createdEntity, setCreatedEntity] = useState({})

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
      <div
        style={{
          border: '2px solid blue',
          backgroundColor: 'whitesmoke',
          width: '600px',
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <TreeView nodes={treeNodes} onSelect={() => {}} />
        )}
      </div>
      <JsonView data={{ JsonView: 'test' }} />
      <ul>
        {dataSources.map((ds) => (
          <li key={ds.id}>{ds.name}</li>
        ))}
      </ul>
      <BlueprintPicker formData={'A-BP'} onChange={() => console.log('123')} />
      <UIPluginSelector
        type={'dmss://DemoDataSource/DemoPackage/DummyBlueprint'}
        absoluteDottedId={'DemoDataSource/f5282220-4a90-4d02-8f34-b82255fc91d5'}
      />
      <Jobs />
      <p>Test create new NamedEntity:</p>
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
          <h2>Created entity:</h2>
          <JsonView data={createdEntity} />
        </>
      )}
    </div>
  )
}

export default App
