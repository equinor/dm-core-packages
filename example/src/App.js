import {
  BlueprintPicker,
  JsonView,
  DmssAPI,
  FSTreeContext,
  TreeView,
  Loading,
  useDataSources,
  TDataSource,
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
        {dataSources.map((ds: TDataSource) => (
          <li key={ds.id}>{ds.name}</li>
        ))}
      </ul>
      <BlueprintPicker formData={'A-BP'} onChange={() => console.log('123')} />
      <Jobs />
    </div>
  )
}

export default App
