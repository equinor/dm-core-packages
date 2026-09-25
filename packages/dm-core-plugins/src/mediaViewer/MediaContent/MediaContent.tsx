import { Button, Icon, Table, Typography } from '@equinor/eds-core-react'
import { download, info_circle } from '@equinor/eds-icons'
import { DateTime } from 'luxon'
import { type ReactElement, useEffect, useRef, useState } from 'react'
import { Stack } from '../../common'
import { formatBytes } from '../../utils'
import { getStaskMetadata } from '../stask-utils'
import { MediaContentPopover } from './MediaContentPopover/MediaContentPopover'
import { MetaItem } from './MetaItem/MetaItem'
import { MediaWrapper, MetaPopoverButton, NoPreviewMessage } from './styles'
import type { MediaContentProps } from './types'

export const MediaContent = (props: MediaContentProps): ReactElement => {
  const { blobUrl, downloadFile, meta, config } = props
  const [showInfoPopover, setShowInfoPopover] = useState(false)
  const referenceElement = useRef<HTMLButtonElement>(null)
  const isStask = meta.filetype?.toLowerCase() === 'stask'
  const [simaVersion, setSimaVersion] = useState<string>()
  const [releaseNotes, setReleaseNotes] = useState<
    Awaited<ReturnType<typeof getStaskMetadata>>['releaseNotes']
  >([])

  useEffect(() => {
    if (isStask && blobUrl) {
      let cancelled = false
      getStaskMetadata(blobUrl).then((metadata) => {
        if (!cancelled) {
          setSimaVersion(metadata.simaVersion)
          setReleaseNotes(metadata.releaseNotes)
        }
      })
      return () => {
        cancelled = true
      }
    }
  }, [isStask, blobUrl])

  function renderMediaElement() {
    if (meta.contentType?.includes('image')) {
      return blobUrl ? (
        <img
          src={blobUrl}
          alt={meta.title}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      ) : null
    } else if (meta.contentType?.includes('video')) {
      return (
        // biome-ignore lint/a11y/useMediaCaption: No captions for example video
        <video
          src={blobUrl}
          controls
          autoPlay={false}
          style={{
            width: '100% ',
            height: 'auto',
          }}
        />
      )
    } else if (meta.contentType === 'application/pdf') {
      return (
        <embed
          title={meta.title}
          src={blobUrl}
          type={meta.contentType}
          style={{ width: '100%', height: '100%' }}
          data-testid='embedded-document'
        />
      )
    } else {
      return (
        <NoPreviewMessage
          spacing={1}
          padding={0.75}
          alignItems='flex-start'
          data-testid='unknown-file-message'
        >
          <Stack>
            <Typography as='h5' color='primary' token={{ fontWeight: 500 }}>
              {isStask ? 'SIMA stask file' : 'No preview available'}
            </Typography>
            <Typography>
              A preview for{' '}
              <Typography as='span' token={{ fontFamily: 'monospace' }}>
                {meta.filetype.length > 0 ? meta.filetype : 'binary'}
              </Typography>{' '}
              {isStask
                ? 'files cannot be shown. Please download the file and open it in SIMA.'
                : 'files cannot be shown. Please download the file and open it in the appropriate software.'}
            </Typography>
          </Stack>
          <Stack spacing={0.25} fullWidth>
            <MetaItem
              title='File name'
              value={`${meta.title}.${meta.filetype}`}
            />
            {meta.fileSize !== undefined && (
              <MetaItem title='File size' value={formatBytes(meta.fileSize)} />
            )}
            {meta.date && (
              <MetaItem
                title='Date'
                value={DateTime.fromISO(meta.date.replace(' ', 'T')).toFormat(
                  'dd/MM/yyyy HH:mm'
                )}
              />
            )}
            {meta.author && <MetaItem title='Author' value={meta.author} />}
            {isStask && simaVersion && (
              <MetaItem title='SIMA version' value={simaVersion} />
            )}
          </Stack>
          {isStask && releaseNotes.length > 0 && (
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
          )}
          <Button onClick={downloadFile}>
            <Icon size={16} data={download} />
            Download
          </Button>
        </NoPreviewMessage>
      )
    }
  }

  return (
    <MediaWrapper
      $height={config.height}
      $width={config.width}
      $fill={config.fill}
      $isDocument={meta.contentType === 'application/pdf'}
    >
      {!(meta.filetype === 'pfd') &&
        (config.showMeta || config.showDescription) && (
          <MetaPopoverButton
            onClick={() => setShowInfoPopover(!showInfoPopover)}
            variant='ghost_icon'
            aria-haspopup
            aria-expanded={showInfoPopover}
            ref={referenceElement}
          >
            <Icon data={info_circle} title='view meta info' />
          </MetaPopoverButton>
        )}
      {renderMediaElement()}
      <MediaContentPopover
        isOpen={showInfoPopover}
        onClose={() => setShowInfoPopover(false)}
        config={config}
        meta={meta}
        blobUrl={blobUrl}
        popoverButtonRef={referenceElement}
      />
    </MediaWrapper>
  )
}
