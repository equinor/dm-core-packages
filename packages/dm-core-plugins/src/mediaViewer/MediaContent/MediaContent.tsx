import { Button, Icon, Popover, Typography } from '@equinor/eds-core-react'
import { download, external_link, info_circle } from '@equinor/eds-icons'
import { type ReactElement, useRef, useState } from 'react'

import { tokens } from '@equinor/eds-tokens'
import { DateTime } from 'luxon'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { Stack } from '../../common'
import { createSyntheticFileDownload, formatBytes } from '../../utils'
import { MetaItem } from './MetaItem/MetaItem'
import { MediaWrapper, MetaPopoverButton } from './styles'
import type { MediaContentProps } from './types'
import { isViewableInBrowser } from './utils'

const NoPreviewMessage = styled(Stack)`
  border: 1px solid ${tokens.colors.interactive.primary__resting.rgba};
  background: ${tokens.colors.interactive.primary__hover_alt.rgba};
`

export const MediaContent = (props: MediaContentProps): ReactElement => {
  const { blobUrl, getBlobUrl, meta, config } = props
  const [showInfoPopover, setShowInfoPopover] = useState(false)
  const referenceElement = useRef<HTMLButtonElement>(null)

  async function downloadFile() {
    const url = blobUrl || (await getBlobUrl())
    createSyntheticFileDownload(url, `${meta.title}.${meta.filetype}`)
  }

  function renderMediaElement() {
    if (meta.contentType?.includes('image')) {
      return (
        <img
          src={blobUrl}
          alt={meta.title}
          style={{
            maxWidth: config.width ?? '100%',
            width: '100%',
            height: config.height ?? 'auto',
          }}
        />
      )
    } else if (meta.contentType?.includes('video')) {
      return (
        // biome-ignore lint/a11y/useMediaCaption: No captions for example video
        <video
          src={blobUrl}
          controls
          autoPlay={false}
          style={{
            width: config.width ?? '100% ',
            height: config.height ?? 'auto',
            maxWidth: 'unset',
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
          height={config.height}
          width={config.width}
          data-testid='embeded-document'
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
              No preview available
            </Typography>
            <Typography>
              A preview for{' '}
              <Typography as='span' token={{ fontFamily: 'monospace' }}>
                {meta.filetype.length > 0 ? meta.filetype : 'binary'}
              </Typography>{' '}
              files cannot be shown. Please download the file and open it in the
              appropriate software.
            </Typography>
          </Stack>
          <Button onClick={downloadFile}>
            <Icon size={16} data={download} />
            Download
          </Button>
        </NoPreviewMessage>
      )
    }
  }

  return (
    <>
      <MediaWrapper $height={config.height} $width={config.width}>
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
      </MediaWrapper>
      {(config.showMeta || config.showDescription) &&
        createPortal(
          <Popover
            open={showInfoPopover}
            anchorEl={referenceElement.current}
            onClose={() => setShowInfoPopover(false)}
            style={{
              overflow: 'auto',
              maxWidth: '100vw',
            }}
          >
            <Popover.Header>
              <Popover.Title>{config.caption ?? meta?.title}</Popover.Title>
            </Popover.Header>
            <Popover.Content>
              <Stack spacing={0.5} fullWidth style={{ minWidth: 280 }}>
                {config.showDescription && config.description && (
                  <p style={{ maxWidth: '320px' }}>{config.description}</p>
                )}
                {config.showMeta && (
                  <Stack spacing={0.25} fullWidth>
                    <MetaItem
                      title='File name'
                      value={`${meta.title}.${meta.filetype}`}
                    />
                    <MetaItem title='Author' value={meta.author} />
                    <MetaItem title='Filetype' value={meta.filetype} />
                    <MetaItem
                      title='File size'
                      value={formatBytes(meta.fileSize)}
                    />
                    <MetaItem
                      title='Date'
                      value={DateTime.fromISO(
                        meta.date.replace(' ', 'T')
                      ).toFormat('dd/MM/yyyy HH:mm')}
                    />
                  </Stack>
                )}
              </Stack>
            </Popover.Content>
            <Popover.Actions>
              <Stack
                direction='row'
                spacing={0.25}
                fullWidth
                justifyContent='center'
              >
                {isViewableInBrowser(meta.contentType) && (
                  <Button
                    variant='ghost'
                    as='a'
                    href={blobUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Icon size={16} data={external_link} />
                    New tab
                  </Button>
                )}
                <Button
                  download={`${meta.title}.${meta.filetype}`}
                  href={blobUrl}
                  variant='ghost'
                >
                  <Icon size={16} data={download} />
                  Download
                </Button>
              </Stack>
            </Popover.Actions>
          </Popover>,
          document.body
        )}
    </>
  )
}
