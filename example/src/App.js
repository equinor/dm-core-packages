import {
  BlueprintPicker,
  JsonView,
  DmssAPI,
  FSTreeContext,
  TreeView,
  Loading,
  useDataSources,
  UIPluginSelector,
} from '@development-framework/dm-core'
import { useContext } from 'react'
import { Jobs } from './test_components/Jobs'

function App() {
  const dmssAPI = new DmssAPI('')

  const { treeNodes, loading } = useContext(FSTreeContext)

  const dataSources = useDataSources(dmssAPI)

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
        {loading ? <Loading /> : <TreeView nodes={treeNodes} />}
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
    </div>
  )
}

export default App
