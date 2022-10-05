import {
  AccessControlList,
  BlueprintPicker,
  JsonView,
  DmssAPI,
  FSTreeContext,
  TreeView,
  DataSourceInformation,
} from '@development-framework/dm-core'
import { useContext } from 'react'
import { AxiosResponse } from 'axios'

function App() {
  const dmssAPI = new DmssAPI('')

  const { treeNodes, loading } = useContext(FSTreeContext)

  dmssAPI
    .dataSourceGetAll()
    .then((res: AxiosResponse<DataSourceInformation[]>) => {
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
        height: '1080px',
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
        <TreeView nodes={treeNodes} />
      </div>
      <JsonView data={{ JsonView: 'test' }} />
      <AccessControlList dataSourceId={'123'} documentId={'12356'} />
      <BlueprintPicker formData={'A-BP'} onChange={() => console.log('123')} />
    </div>
  )
}

export default App
