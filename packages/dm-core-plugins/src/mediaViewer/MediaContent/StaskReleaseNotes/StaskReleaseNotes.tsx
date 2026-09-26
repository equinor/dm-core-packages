import { CircularProgress, Table, Typography } from '@equinor/eds-core-react'
import { Stack } from '../../../common'
import type { StaskReleaseNote } from '../../stask-utils'

type StaskReleaseNotesProps = {
  isLoading: boolean
  hasBlobUrl: boolean
  releaseNotes: StaskReleaseNote[]
}

/**
 * Renders the stask release notes section of the media viewer: a loading
 * indicator while the stask file is being downloaded and/or its release
 * notes are being extracted, or a table of release notes (one row per
 * component) once available.
 */
export function StaskReleaseNotes(props: StaskReleaseNotesProps) {
  const { isLoading, hasBlobUrl, releaseNotes } = props

  if (isLoading) {
    return (
      <Stack
        direction='row'
        spacing={0.5}
        alignItems='center'
        data-testid='stask-release-notes-loading'
      >
        <CircularProgress size={16} />
        <Typography variant='caption'>
          {hasBlobUrl
            ? 'Fetching stask release notes…'
            : 'Downloading stask file…'}
        </Typography>
      </Stack>
    )
  }

  if (releaseNotes.length === 0) return null

  return (
    <Stack spacing={0.25} fullWidth>
      <Typography variant='h6'>Release notes</Typography>
      <Table style={{ width: '100%' }}>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Repository</Table.Cell>
            <Table.Cell>Release</Table.Cell>
            <Table.Cell>Date</Table.Cell>
            <Table.Cell>SIMA</Table.Cell>
            <Table.Cell>Branch</Table.Cell>
            <Table.Cell>User</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {releaseNotes.map((note) => (
            <Table.Row key={note.path}>
              <Table.Cell>
                {note.repositoryUrl ? (
                  <a
                    href={note.repositoryUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {note.component}
                  </a>
                ) : (
                  note.component
                )}
              </Table.Cell>
              <Table.Cell>{note.version ?? '—'}</Table.Cell>
              <Table.Cell>{note.date ?? '—'}</Table.Cell>
              <Table.Cell>{note.simaVersion ?? '—'}</Table.Cell>
              <Table.Cell>{note.branch ?? '—'}</Table.Cell>
              <Table.Cell>
                {note.triggeredBy ? `@${note.triggeredBy}` : '—'}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  )
}
