import {
  GetJobResultResponse,
  JobStatus,
  Loading,
  useJob,
} from '@development-framework/dm-core'
import React, {useContext, useState} from 'react'
import { Button, Chip, Icon } from '@equinor/eds-core-react'
import { stop, play, refresh, autorenew } from '@equinor/eds-icons'
import styled from 'styled-components'

const JobButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`

export const JobControl = (props: { jobEntityId: string }) => {
  const { jobEntityId } = props
  const {
    start,
    error,
    isLoading,
    // fetchResult,
    fetchStatusAndLogs,
    logs,
    status,
    remove,
  } = useJob(jobEntityId)
  const [result, setResult] = useState<GetJobResultResponse>()
  const [jobIsStarted, setJobIsStarted] = useState<boolean>(false)

  if (isLoading) return <Loading />
  if (error) console.error(error)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Chip>Status: {status}</Chip>
      <JobButtonWrapper>
        {jobIsStarted ? (
          <Button
            onClick={() => {
              setJobIsStarted(false)
              remove()
            }}
            variant="contained"
          >
            <Icon data={stop}></Icon>
            Stop
          </Button>
        ) : (
          <Button
            onClick={() => {
              start()
              setJobIsStarted(true)
            }}
            variant="contained"
          >
            <Icon data={play}></Icon>
            Start
          </Button>
        )}
        {(status === JobStatus.Completed || status === JobStatus.Failed) && <Button
            onClick={() => fetchStatusAndLogs()}
            variant={'outlined'}
            aria-label='Re-run job'
        >
          <Icon data={autorenew}/>
        </Button>}
        {/* TODO: Make this button query the API for an update on the running job */}
        {status === JobStatus.Running && <Button variant='outlined' onClick={() => fetchStatusAndLogs()} aria-label='Get job status'>
          <Icon data={refresh}/>
        </Button>}
        {/* The results should be loaded automatically when the job is finished, and loaded initially if a result is available */}
        {/*<Button*/}
        {/*  onClick={() =>*/}
        {/*    fetchResult().then((res: GetJobResultResponse) => setResult(res))*/}
        {/*  }*/}
        {/*  variant={'outlined'}*/}
        {/*  disabled={status === JobStatus.NotStarted}*/}
        {/*>*/}
        {/*  Get results*/}
        {/*</Button>*/}
      </JobButtonWrapper>

      <h4>Logs:</h4>
      {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : <pre>{logs}</pre>}
      <h4>Result:</h4>
      {result && (
        <>
          <pre>{result.message}</pre>
          <pre>{result.result}</pre>
        </>
      )}
    </div>
  )
}
