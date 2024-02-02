import { Button, Icon, Popover } from '@equinor/eds-core-react'
import { download, external_link, info_circle } from '@equinor/eds-icons'
import { ReactElement, useRef, useState } from 'react'
import styled from 'styled-components'

import { DateTime } from 'luxon'
import { createPortal } from 'react-dom'
import { imageFiletypes, videoFiletypes } from '../utils/filetypes'
import { mimeTypes } from '../utils/mime-types'
import { formatBytes } from '../utils/stringUtilities'

interface MediaContentConfig {
  height?: number
  width?: number
  showMeta?: boolean
  caption?: string
  description?: string
}

interface MediaContentProps {
  blobUrl: string
  config: MediaContentConfig
  meta: {
    author: string
    fileSize: number
    title?: string
    date: string
    filetype: string
  }
}

const MediaWrapper = styled.div<{ $height?: number; $width?: number }>`
  height: fit-content;
  width: fit-content;
  position: relative;
`

const MetaPopoverButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 50;
  color: #595959;
`

export const MediaContent = (props: MediaContentProps): ReactElement => {
  const { blobUrl, meta, config } = props
  const [showMeta, setShowMeta] = useState(false)
  const referenceElement = useRef()

  function renderMediaElement(filetype: string) {
    if (imageFiletypes.includes(filetype)) {
      return (
        <img
          src={blobUrl}
          alt={meta.title}
          style={{
            width: config.width ?? '100%',
            height: config.height ?? 'auto',
            maxWidth: 'unset',
          }}
        />
      )
    } else if (videoFiletypes.includes(filetype)) {
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
    } else if (filetype === 'pdf') {
      return (
        <embed
          title={meta.title}
          src={blobUrl}
          type={mimeTypes[filetype] || 'application/octet-stream'}
          style={{ width: '100%', height: '100%' }}
          height={config.height}
          width={config.width}
          data-testid='embeded-document'
        />
      )
    } else {
      return (
        <div
          className='border border-equinor-green bg-equinor-lightgreen p-3 '
          data-testid='unknown-file-message'
        >
          <h2 className='text-lg text-equinor-green font-medium'>
            No preview available
          </h2>
          <p className='gap-1 mb-3 items-center block'>
            A preview for{' '}
            <code className='text-sm'>
              {meta.filetype.length > 0 ? meta.filetype : 'binary'}
            </code>{' '}
            files cannot be shown. Please download the file and open it in the
            appropriate software.
          </p>
          <Button download={`${meta.title}.${meta.filetype}`} href={blobUrl}>
            <Icon size={16} data={download} />
            Download
          </Button>
        </div>
      )
    }
  }

  return (
    <>
      <MediaWrapper $height={config.height} $width={config.width}>
        {!['pdf'].includes(meta.filetype) && (
          <MetaPopoverButton
            onClick={() => setShowMeta(!showMeta)}
            variant='ghost_icon'
            aria-haspopup
            aria-expanded={showMeta}
            ref={referenceElement}
          >
            <Icon data={info_circle} title='view meta info' />
          </MetaPopoverButton>
        )}
        {renderMediaElement(meta.filetype)}
      </MediaWrapper>
      {createPortal(
        <Popover
          open={showMeta}
          anchorEl={referenceElement.current}
          onClose={() => setShowMeta(false)}
          role='dialog'
          style={{
            overflow: 'auto',
            maxWidth: '100vw',
          }}
        >
          <Popover.Header>
            <Popover.Title>{config.caption ?? 'Meta'}</Popover.Title>
          </Popover.Header>
          <Popover.Content>
            <div className='mb-5'>
              <label className='font-bold text-sm'>Description</label>
              <p>{config.description}</p>
            </div>
            {config.showMeta && (
              <div className='grid grid-cols-2 font-normal text-xs'>
                <label className='font-bold'>File name:</label>
                <span> {meta.title}</span>
                <label className='font-bold'>Author:</label>
                <span> {meta.author}</span>
                <label className='font-bold'>Filetype:</label>
                <span> {meta.filetype}</span>
                <label className='font-bold'>Filesize:</label>
                <span> {formatBytes(meta.fileSize)}</span>
                <label className='font-bold'>Date:</label>
                <span>
                  {DateTime.fromISO(meta.date.replace(' ', 'T')).toFormat(
                    'dd/MM/yyyy HH:mm'
                  )}
                </span>
              </div>
            )}
          </Popover.Content>
          <Popover.Actions>
            <div className='flex justify-start w-full'>
              <Button
                variant='ghost'
                as='a'
                className='transition-all'
                href={blobUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Icon size={16} data={external_link} />
                New tab
              </Button>
              <Button
                download={`${meta.title}.${meta.filetype}`}
                href={blobUrl}
                variant='ghost'
              >
                <Icon size={16} data={download} />
                Download
              </Button>
            </div>
          </Popover.Actions>
        </Popover>,
        document.body
      )}
    </>
  )
}
