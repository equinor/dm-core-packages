import {
  GetJobResultResponse,
  JobStatus,
  useJob,
} from '@development-framework/dm-core'
import React, { useState } from 'react'
import { Button, Card, Icon } from '@equinor/eds-core-react'
import { refresh } from '@equinor/eds-icons'
import styled from 'styled-components'
import { JobControlButton } from './JobControlButton'

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
    fetchResult,
    fetchStatusAndLogs,
    logs,
    status,
    remove,
  } = useJob(jobEntityId)
  const [result, setResult] = useState<GetJobResultResponse>()

  if (error) console.error(error)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <JobButtonWrapper>
        <JobControlButton jobStatus={status} start={start} halt={remove} />
        {status === JobStatus.Running && (
          <Button
            variant="outlined"
            onClick={() => fetchStatusAndLogs()}
            aria-label="Get job status"
          >
            <Icon data={refresh} />
          </Button>
        )}
        <Button
          onClick={() =>
            fetchResult().then((res: GetJobResultResponse) => setResult(res))
          }
          variant={'outlined'}
          disabled={status === JobStatus.NotStarted}
        >
          Get results
        </Button>
      </JobButtonWrapper>
      {status === JobStatus.Failed && (
        <Card
          variant='danger'
          style={{ marginTop: '8px' }}
        >
          <Card.Header>Job status: {status}</Card.Header>
        </Card>
      )}
      {(error || logs) && (
        <>
          <h4>Logs:</h4>
          {error ? (
            <pre>{JSON.stringify(error, null, 2)}</pre>
          ) : (
            <pre>{logs}</pre>
          )}
        </>
      )}

      {result && (
        <>
          <h4>Result:</h4>
          <pre>{result.message}</pre>
          <pre>{result.result}</pre>
        </>
      )}
    </div>
  )
}
