import {
  AccessControlList,
  BlueprintPicker,
  JsonView,
  DmssAPI,
} from '@development-framework/dm-core'

function App() {
  const dmssAPI = new DmssAPI('', 'http://localhost:8000')

  dmssAPI
    .dataSourceGetAll()
    .then((res) => {
      console.log('data sources found: ', res)
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
      <JsonView data={{ JsonView: 'test' }} />
      <AccessControlList dataSourceId={'123'} documentId={'12356'} />
      <BlueprintPicker formData={'A-BP'} onChange={() => console.log('123')} />
    </div>
  )
}

export default App
