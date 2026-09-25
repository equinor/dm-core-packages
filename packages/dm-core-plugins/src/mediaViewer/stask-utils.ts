import { unzip } from 'fflate'

const META_PROPERTIES_ENTRY = 'meta.properties'
const RELEASE_NOTES_FILENAME = 'RELEASE_NOTES.md'

export interface StaskReleaseNote {
  /** Path of the release notes file inside the archive. */
  path: string
  /** Repository name parsed from the release notes' `Repository:` line
   *  if present, otherwise falls back to the top-level folder the
   *  release notes file lives in inside the archive. */
  component: string
  repositoryUrl?: string
  version?: string
  date?: string
  simaVersion?: string
  branch?: string
  triggeredBy?: string
}

export interface StaskMetadata {
  simaVersion?: string
  releaseNotes: StaskReleaseNote[]
}

/**
 * Parses a Java-style `.properties` file content (key=value per line,
 * `#` comments) into a plain record.
 */
function parseProperties(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue
    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    if (key) result[key] = value
  }
  return result
}

// Matches e.g. "## v0.1.7 — 2026-09-23"
const RELEASE_HEADER_REGEX = /^##\s*(\S+)\s*[—-]\s*([\d-]+)/m
// Matches e.g. "_Repository: [equinor/srs-mooring-sima-model-asgb](https://github.com/equinor/srs-mooring-sima-model-asgb)_"
const RELEASE_REPOSITORY_REGEX =
  /_Repository:\s*\[([^\]]+)\](?:\(([^)]+)\))?_/
// Matches e.g. "_SIMA 4.8.1 · branch `v4_8_1/main` · triggered by @l3abak_"
const RELEASE_META_REGEX =
  /_SIMA\s*([^\s·]+)(?:\s*·\s*branch\s*`([^`]+)`)?(?:\s*·\s*triggered by\s*@?([^\s_]+))?_/

function parseReleaseNotes(path: string, content: string): StaskReleaseNote {
  const pathParts = path.split('/')
  const folderName = pathParts.length > 1 ? pathParts[0] : path

  const headerMatch = content.match(RELEASE_HEADER_REGEX)
  const repositoryMatch = content.match(RELEASE_REPOSITORY_REGEX)
  const metaMatch = content.match(RELEASE_META_REGEX)

  return {
    path,
    component: repositoryMatch?.[1] ?? folderName,
    repositoryUrl: repositoryMatch?.[2],
    version: headerMatch?.[1],
    date: headerMatch?.[2],
    simaVersion: metaMatch?.[1],
    branch: metaMatch?.[2],
    triggeredBy: metaMatch?.[3],
  }
}

/**
 * A `.stask` file is a zip archive. This reads the zip's central directory
 * and selectively decompresses only the small, well-known metadata files
 * (`meta.properties` and any `RELEASE_NOTES.md`) rather than the entire
 * (often very large) archive, keeping the overhead low regardless of the
 * total archive size.
 */
export async function getStaskMetadata(
  blobUrl: string
): Promise<StaskMetadata> {
  const emptyResult: StaskMetadata = { releaseNotes: [] }
  try {
    const response = await fetch(blobUrl)
    const buffer = new Uint8Array(await response.arrayBuffer())

    const entries = await new Promise<Record<string, Uint8Array>>(
      (resolve, reject) => {
        unzip(
          buffer,
          {
            filter: (file) =>
              file.name === META_PROPERTIES_ENTRY ||
              file.name.endsWith(`/${RELEASE_NOTES_FILENAME}`) ||
              file.name === RELEASE_NOTES_FILENAME,
          },
          (err, data) => {
            if (err) reject(err)
            else resolve(data)
          }
        )
      }
    )

    const decoder = new TextDecoder()
    const metaFile = entries[META_PROPERTIES_ENTRY]
    const simaVersion = metaFile
      ? parseProperties(decoder.decode(metaFile)).SIMAVersion
      : undefined

    const releaseNotes = Object.entries(entries)
      .filter(([name]) => name !== META_PROPERTIES_ENTRY)
      .map(([path, data]) => parseReleaseNotes(path, decoder.decode(data)))

    return { simaVersion, releaseNotes }
  } catch (error) {
    console.error('Failed to extract metadata from .stask file', error)
    return emptyResult
  }
}
