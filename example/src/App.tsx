import {
  AuthContext,
  DMApplicationProvider,
  DmssAPI,
  EntityView,
  ErrorResponse,
  TApplication,
} from '@development-framework/dm-core'
import { Button, Card, Icon, Typography } from '@equinor/eds-core-react'
import { refresh } from '@equinor/eds-icons'

import { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ViewPage from './ViewPage'
import plugins from './plugins'
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
  const [application, setApplication] = useState<TApplication>()
  const [error, setError] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { token } = useContext(AuthContext)

  useEffect(() => {
    setIsLoading(true)
    const dmssAPI = new DmssAPI(token, import.meta.env.VITE_DMSS_URL)
    dmssAPI
      .documentGet({ address: idReference })
      .then((response: any) => {
        setApplication(response.data)
        setError(null)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        setError(error.response?.data || { message: error.name, data: error })
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <></>
  if (error || !application || !application.type) {
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
  const enableBlueprintCache =
    import.meta.env.VITE_BLUEPRINT_CACHE_ENABLED === '1' || true

  return (
    <DMApplicationProvider
      plugins={plugins}
      application={application}
      dmJobPath={import.meta.env.VITE_DM_JOB_URL}
      dmssBasePath={import.meta.env.VITE_DMSS_URL}
      enableBlueprintCache={enableBlueprintCache}
    >
      <RouterProvider router={router} />
    </DMApplicationProvider>
  )
}

export default App
