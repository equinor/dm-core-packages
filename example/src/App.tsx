import {
  ApplicationContext,
  EntityView,
  FSTreeProvider,
  Loading,
  RoleProvider,
  TApplication,
  useDocument,
} from '@development-framework/dm-core'
import '@development-framework/dm-core/dist/main.css'
import { Button, Card, Icon, Typography } from '@equinor/eds-core-react'
import { refresh } from '@equinor/eds-icons'
import './main.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ViewPage from './ViewPage'

const appNotReadyPage = () => (
  <div
    style={{
      width: '100vw',
      height: '25vh',
      display: 'flex',
      placeItems: 'center',
      placeContent: 'center',
    }}
  >
    <Card style={{ width: '500px', boxShadow: '3px 4px 14px 0' }}>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant='h5'>Application not ready</Typography>
          <Typography variant='body_short'>
            Development Framework application has not completed the setup
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Typography variant='body_short'>
          A Development Framework application is hosted here, but is not yet
          ready for use. Try refreshing the page in a while, and you should be
          able to use the application. If the application remains unavailable
          for an extended time, contact the system administrator.
        </Typography>
      </Card.Content>
      <Card.Actions alignRight>
        <Button variant={'outlined'} onClick={() => window.location.reload()}>
          <Icon data={refresh} title='settings action'></Icon>
          Refresh
        </Button>
      </Card.Actions>
    </Card>
  </div>
)

function App() {
  const idReference: string = `${import.meta.env.VITE_DATA_SOURCE}/$${
    import.meta.env.VITE_APPLICATION_ID
  }`
  const {
    document: application,
    isLoading,
    error,
  } = useDocument<TApplication>(idReference)

  if (isLoading) return <Loading />

  if (error || !application) {
    console.error(error)
    return appNotReadyPage()
  }
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <EntityView idReference={idReference} type={application?.type} />
      ),
    },
    {
      path: '/view',
      element: <ViewPage />,
      errorElement: (
        <div
          style={{
            border: '2px solid',
            borderColor: '#6a94c6',
            backgroundColor: '#cadcf1',
            padding: '20px',
            margin: '20px',
            borderRadius: '5px',
          }}
        >
          To view a specific entity, provide it's ID as a parameter in the URL.{' '}
          <p>
            For example:{' '}
            <code>'/view/?documentId=dmss://dataSource/123.attribute' </code>
          </p>
        </div>
      ),
    },
  ])

  return (
    <ApplicationContext.Provider value={application}>
      <RoleProvider roles={application?.roles || []}>
        <FSTreeProvider visibleDataSources={application?.dataSources || []}>
          <RouterProvider router={router} />
        </FSTreeProvider>
      </RoleProvider>
    </ApplicationContext.Provider>
  )
}

export default App
