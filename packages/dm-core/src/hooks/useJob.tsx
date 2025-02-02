import type { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useApplication } from '../ApplicationContext'
import {
  type DeleteJobResponse,
  type ErrorResponse,
  type GetJobResultResponse,
  JobStatus,
  type StartJobResponse,
  type StatusJobResponse,
} from '../services/api/configs/gen-job'
import type { TJob } from '../types'

interface IUseJob {
  start: () => Promise<StartJobResponse | null>
  fetchStatusAndLogs: () => Promise<StatusJobResponse | null>
  status: JobStatus
  remove: () => Promise<DeleteJobResponse | null>
  fetchResult: () => any // TODO: Type set this return value
  logs: string[]
  progress: GLfloat | null
  isLoading: boolean
  error: ErrorResponse | undefined
  exists: boolean
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
 * @param entityId The ID of the job entity present in DMSS
 * @param jobId The ID of the job
 */
export function useJob(entityId?: string, jobId?: string): IUseJob {
  const [hookJobId, setHookJobId] = useState<string | undefined>(jobId)
  const [logs, setLogs] = useState<string[]>(['No logs fetched'])
  const [progress, setProgress] = useState<GLfloat | null>(null)
  const [status, setStatus] = useState<JobStatus>(JobStatus.NotStarted)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorResponse>()
  const { dmJobApi } = useApplication()
  const { dmssAPI } = useApplication()

  let statusIntervalId: NodeJS.Timeout

  useEffect(() => {
    if (hookJobId) return
    if (entityId) {
      setIsLoading(true)
      dmssAPI
        .documentGet({ address: entityId })
        // @ts-ignore
        .then((response: AxiosResponse<TJob>) => {
          if (response.data?.uid) {
            setStatus(response.data.status)
            if (response.data.status !== JobStatus.Removed) {
              // The job must be started before it has an UID
              setHookJobId(response.data.uid)
            }
            return
          }
          setStatus(response.data.status)
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          setError(error.response?.data)
        })
        .finally(() => setIsLoading(false))
    }
  }, [entityId])

  // When hookJobId changes, we register an interval to check status.
  // The interval is deregistered if the status of the job is not "Running"
  useEffect(() => {
    if (!hookJobId) return
    fetchStatusAndLogs() // Do one fetch immediately
    statusIntervalId = setInterval(fetchStatusAndLogs, 5000)
    return () => clearInterval(statusIntervalId)
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
    return dmJobApi
      .startJob({ jobDmssId: entityId })
      .then((response: AxiosResponse<StartJobResponse>) => {
        setHookJobId(response.data.uid)
        setLogs([response.data.message])
        setError(undefined)
        setStatus(response.data.status)
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data)
        setStatus(JobStatus.Failed)
        return null
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  async function fetchStatusAndLogs(): Promise<StatusJobResponse | null> {
    if (!hookJobId) {
      clearInterval(statusIntervalId)
      const log = ['The job has not been started']
      setLogs(log)
      setStatus(JobStatus.NotStarted)
      return Promise.resolve({
        status: JobStatus.NotStarted,
        log: log,
        percentage: 0.0,
      })
    }

    setIsLoading(true)
    return dmJobApi
      .jobStatus({ jobUid: hookJobId })
      .then((response: AxiosResponse<StatusJobResponse>) => {
        if (response.data.percentage) {
          setProgress(response.data.percentage)
        }
        setLogs(
          response.data.log ?? ['No logs or status returned from job handler']
        )
        if (response.data.status !== status) setStatus(response.data.status)
        if (
          (
            [
              JobStatus.Failed,
              JobStatus.Completed,
              JobStatus.Registered,
            ] as JobStatus[]
          ).includes(response.data.status)
        ) {
          clearInterval(statusIntervalId)
        }
        setError(undefined)
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        setLogs([
          JSON.stringify(error.response?.data || 'An unknown error occurred'),
        ])
        clearInterval(statusIntervalId)
        return null
      })
      .finally(() => setIsLoading(false))
  }

  function remove(): Promise<DeleteJobResponse | null> {
    if (!hookJobId) {
      return Promise.resolve({
        status: status,
        response: 'The job has not been started',
      })
    }

    setIsLoading(true)
    clearInterval(statusIntervalId)

    return dmJobApi
      .removeJob({ jobUid: hookJobId })
      .then((response: AxiosResponse<DeleteJobResponse>) => {
        setStatus(response.data.status)
        setError(undefined)
        setLogs([])
        setProgress(0.0)
        return response.data
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        setError(error.response?.data)
        return null
      })
      .finally(() => {
        setIsLoading(false)
      })
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

  return {
    start,
    status,
    fetchStatusAndLogs,
    remove,
    fetchResult,
    logs,
    progress,
    isLoading,
    error,
    exists: !!hookJobId,
  }
}
