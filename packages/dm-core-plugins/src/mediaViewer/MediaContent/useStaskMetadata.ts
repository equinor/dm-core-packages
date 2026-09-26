import { useEffect, useState } from 'react'
import { getStaskMetadata } from '../stask-utils'

type StaskMetadataState = {
  simaVersion?: string
  releaseNotes: Awaited<ReturnType<typeof getStaskMetadata>>['releaseNotes']
  /** True while the stask file is being downloaded and/or its metadata is
   *  being extracted. Always `false` for non-stask files. */
  isLoading: boolean
}

/**
 * Fetches and extracts SIMA metadata (version + release notes) from a
 * `.stask` archive once its blob is available. This is a no-op unless
 * `isStask` is `true`, so it's safe to call unconditionally for any
 * file type rendered by `MediaContent`.
 *
 * `isLoading` is `true` both while the underlying file blob is still
 * being downloaded (`blobUrl` not yet set) and while the archive's
 * metadata is being extracted from it, so callers can show a single
 * loading indicator covering the whole process.
 */
export function useStaskMetadata(
  isStask: boolean,
  blobUrl: string | undefined
): StaskMetadataState {
  const [simaVersion, setSimaVersion] = useState<string>()
  const [releaseNotes, setReleaseNotes] = useState<
    StaskMetadataState['releaseNotes']
  >([])
  const [isExtracting, setIsExtracting] = useState(false)

  useEffect(() => {
    if (isStask && blobUrl) {
      let cancelled = false
      setIsExtracting(true)
      getStaskMetadata(blobUrl)
        .then((metadata) => {
          if (!cancelled) {
            setSimaVersion(metadata.simaVersion)
            setReleaseNotes(metadata.releaseNotes)
          }
        })
        .finally(() => {
          if (!cancelled) setIsExtracting(false)
        })
      return () => {
        cancelled = true
      }
    }
  }, [isStask, blobUrl])

  return {
    simaVersion,
    releaseNotes,
    isLoading: isStask && (!blobUrl || isExtracting),
  }
}
