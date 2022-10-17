import {
  BlueprintPicker,
  JsonView,
  DmssAPI,
  FSTreeContext,
  TreeView,
  Loading,
} from '@development-framework/dm-core'
import { useContext } from 'react'
import { Jobs } from './test_components/Jobs'

function App() {
  const dmssAPI = new DmssAPI('')

  const { treeNodes, loading } = useContext(FSTreeContext)

  dmssAPI
    .dataSourceGetAll()
    .then((res) => {
      console.log('data sources found: ', res.data)
    })
    .catch((err) => {
      console.error(err.message)
    })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '50px',
        height: '680px',
        width: '1920px',
        justifyContent: 'space-evenly',
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
      <BlueprintPicker formData={'A-BP'} onChange={() => console.log('123')} />
      <Jobs />
    </div>
  )
}

export default App
