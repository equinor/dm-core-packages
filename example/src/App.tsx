import '@development-framework/dm-core/dist/main.css'
import {
  Datepicker,
  EntityView,
  FSTreeProvider,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import React, { useState } from 'react'
import './main.css'

function App() {
  const idReference: string = `${import.meta.env.VITE_DATA_SOURCE}/$${
    import.meta.env.VITE_APPLICATION_ID
  }`
  const {
    document: application,
    isLoading,
    error,
  } = useDocument<TGenericObject>(idReference)
  const [selectedDate, setSelectedDate] = useState('2023-11-30T14:13:22.407Z')

  if (isLoading) return <Loading />

  if (error) {
    console.error(error)
    return (
      <div style={{ color: 'red' }}>
        <b>Error:</b>Failed to load data, see web console for details
      </div>
    )
  }

  return (
    <FSTreeProvider visibleDataSources={application?.dataSources}>
      <div className='p-10'>
        <Datepicker
          variant='datetime'
          label='label'
          id='some-id'
          readonly={true}
          value={selectedDate}
          onChange={(date: string) => setSelectedDate(date)}
          useMinutes={false}
        />
        <p className='h-10 text-red-600'>{selectedDate}</p>
      </div>
      <EntityView idReference={idReference} type={application?.type} />
    </FSTreeProvider>
  )
}

export default App
