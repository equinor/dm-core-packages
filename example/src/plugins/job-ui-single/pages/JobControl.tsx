import {
  GetJobResultResponse,
  JobStatus,
  Loading,
  useJob,
} from '@development-framework/dm-core'
import React, { useState } from 'react'
import {Button, Chip, Icon, Typography} from '@equinor/eds-core-react'
import { stop, play } from '@equinor/eds-icons'

export const JobControl = (props: { jobEntityId: string }) => {
  const { jobEntityId } = props
  const {
    start,
    error,
    isLoading,
    fetchResult,
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
    <div>
      <Chip>Status: {status}</Chip>

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
      <button
        onClick={() => fetchStatusAndLogs()}
        disabled={status === JobStatus.NotStarted}
      >
        Refresh status and logs
      </button>
      <button
        onClick={() =>
          fetchResult().then((res: GetJobResultResponse) => setResult(res))
        }
        disabled={status === JobStatus.NotStarted}
      >
        Get results
      </button>

      <Typography variant="h4">Logs:</Typography>
      {error ? <pre>{JSON.stringify(error, null, 2)}</pre> : <pre>{logs}</pre>}
      <Typography variant="h4">Result:</Typography>
      {result && (
        <>
          <pre>{result.message}</pre>
          <pre>{result.result}</pre>
        </>
      )}
    </div>
  )
}
