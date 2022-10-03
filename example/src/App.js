import {
  AccessControlList,
  BlueprintPicker,
  JsonView,
} from '@development-framework/dm-core'

function App() {
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
