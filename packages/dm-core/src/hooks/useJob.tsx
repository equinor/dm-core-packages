import { useContext, useEffect, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import {
  ErrorResponse,
  GetJobResultResponse,
  JobStatus,
  StartJobResponse,
  StatusJobResponse,
} from '../services/api/configs/gen-job'
import { DmJobAPI } from '../services'
import { TJob } from '../types'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDMSS } from '../context/DMSSContext'

interface IUseJob {
  start: () => Promise<StartJobResponse | null>
  fetchStatusAndLogs: () => Promise<StatusJobResponse | null>
  status: JobStatus
  remove: () => Promise<string | null>
  fetchResult: () => any // TODO: Type set this return value
  logs: string
  isLoading: boolean
  error: ErrorResponse | undefined
}

/**
 * A hook for working with jobs.
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useJob } from '@data-modelling-tool/core'
 * const {
 *   start,
 *   status,
 *   fetchStatusAndLogs,
 *   remove,
 *   fetchResult,
 *   logs,
 *   isLoading,
 *   error,
 * } = useJob('SomedataSource/iuni-1321-fsfr)
 *
 * if (isLoading) return <div>Loading...</div>
 *
 * if (error) {
 *   console.error(error)
 *   return <div>Error getting the document</div>
 * }
 *
 *  return (<div>
 *     <Chip>Status: {status}</Chip>
 *     <br />
 *     <button onClick={() => start()}>Start job</button>
 *     <button onClick={() => remove()}>Remove job</button>
 *     <button onClick={() => fetchStatusAndLogs()}>Refresh status and logs</button>
 *     <button onClick={() => fetchResult().then((res: GetJobResultResponse) => setResult(res))} >Get results</button>
 *
 *     <h4>Logs:</h4>
 *     <pre>{logs}</pre>
 *
 *     <h4>Result:</h4>
 *     {result && <>
 *       <pre>{result.message}</pre>
 *       <pre>{result.result}</pre>
 *     </>
 *
 *     }
 * ```
 *
 * @param entityId? The ID of the job entity present in DMSS
 * @param jobId? The ID of the job
 */
export function useJob(entityId?: string, jobId?: string): IUseJob {
  const [hookJobId, setHookJobId] = useState<string | undefined>(jobId)
  const [logs, setLogs] = useState<string>('No logs fetched')
  const [status, setStatus] = useState<JobStatus>(JobStatus.Unknown)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [jobPinger, setJobPinger] = useState<ReturnType<
    typeof setInterval
  > | null>(null)
  const [error, setError] = useState<ErrorResponse>()
  const { token } = useContext(AuthContext)
  const dmJobApi = new DmJobAPI(token)
  const dmssAPI = useDMSS()

  useEffect(() => {
    if (entityId) {
      setIsLoading(true)
      dmssAPI
        .documentGet({ address: entityId })
        // @ts-ignore
        .then((response: AxiosResponse<TJob>) => {
          if (response.data?.uid) {
            // The job must be started before it has an UID
            setHookJobId(response.data._id)
            setStatus(response.data.status)
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          setError(error.response?.data)
        })
        .finally(() => setIsLoading(false))
    }
  }, [entityId])

  useEffect(() => {
    fetchStatusAndLogs()
  }, [hookJobId])

  async function start(): Promise<StartJobResponse | null> {
    if (!entityId) {
      setError({
        status: 500,
        debug: 'No entity Id provided',
        message: 'Failed to start job',
      })
      setStatus(JobStatus.Failed)
      return null
    }
    setIsLoading(true)
    setStatus(JobStatus.Starting)
    return dmJobApi
      .startJob({ jobDmssId: entityId })
      .then((response: AxiosResponse<StartJobResponse>) => {
        console.log(response)
        setHookJobId(response.data.uid)
        setLogs(response.data.message)
        setStatus(JobStatus.Running)
        startJobPing()
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data)
        setStatus(JobStatus.Failed)
        return null
      })
      .finally(() => {
        setIsLoading(false)
        if (status !== JobStatus.Failed) setStatus(JobStatus.Completed)
      })
  }

  async function fetchStatusAndLogs(): Promise<StatusJobResponse | null> {
    if (!hookJobId) {
      const message = 'The job has not been started'
      setLogs(message)
      setStatus(JobStatus.NotStarted)
      return Promise.resolve({
        status: JobStatus.NotStarted,
        log: message,
        message: message,
      })
    }

    setIsLoading(true)

    return dmJobApi
      .jobStatus({ jobUid: hookJobId })
      .then((response: AxiosResponse<StatusJobResponse>) => {
        setLogs(response.data.log ?? '')
        setStatus(response.data.status)
        setError(undefined)
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data)
        return null
      })
      .finally(() => setIsLoading(false))
  }

  function remove(): Promise<string | null> {
    if (!hookJobId) {
      return Promise.resolve('The job has not been started')
    }

    setIsLoading(true)

    stopJobPing()
    return dmJobApi
      .removeJob({ jobUid: hookJobId })
      .then((response: AxiosResponse<string>) => {
        setStatus(JobStatus.Removed)
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data)
        return null
      })
      .finally(() => setIsLoading(false))
  }

  function fetchResult(): Promise<GetJobResultResponse | null> {
    if (!hookJobId) {
      return Promise.resolve(null)
    }

    setIsLoading(true)

    return dmJobApi
      .jobResult({ jobUid: hookJobId })
      .then((response: AxiosResponse<GetJobResultResponse>) => {
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data)
        return null
      })
      .finally(() => setIsLoading(false))
  }

  function startJobPing(): void {
    setJobPinger(setInterval(fetchStatusAndLogs, 2000))
  }
  function stopJobPing(): void {
    // @ts-ignore
    clearInterval(jobPinger)
  }

  return {
    start,
    status,
    fetchStatusAndLogs,
    remove,
    fetchResult,
    logs,
    isLoading,
    error,
  }
}
