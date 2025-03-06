import { Button, Icon, Typography } from '@equinor/eds-core-react'
import { download, info_circle } from '@equinor/eds-icons'
import { type ReactElement, useRef, useState } from 'react'
import { Stack } from '../../common'
import { MediaContentPopover } from './MediaContentPopover/MediaContentPopover'
import { MediaWrapper, MetaPopoverButton, NoPreviewMessage } from './styles'
import type { MediaContentProps } from './types'

export const MediaContent = (props: MediaContentProps): ReactElement => {
  const { blobUrl, downloadFile, meta, config } = props
  const [showInfoPopover, setShowInfoPopover] = useState(false)
  const referenceElement = useRef<HTMLButtonElement>(null)

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
          height={config.height}
          width={config.width}
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
    <MediaWrapper
      $height={config.height}
      $width={config.width}
      $fill={config.fill}
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
