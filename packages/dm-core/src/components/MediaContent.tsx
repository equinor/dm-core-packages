import React, { ReactElement, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Icon, Popover } from '@equinor/eds-core-react'
import { download, external_link, info_circle } from '@equinor/eds-icons'

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
  height: ${(props) => (props.$height ? props.$height + 'px' : undefined)};
  width: ${(props) => (props.$width ? props.$width + 'px' : undefined)};
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
    if (filetype.includes('image')) {
      return (
        <img
          src={blobUrl}
          alt={config.caption && meta.title}
          style={{
            width: config.width ?? '100%',
            height: config.height ?? 'auto',
          }}
        />
      )
    } else if (filetype.includes('video')) {
      return (
        // biome-ignore lint/a11y/useMediaCaption: No captions for example video
        <video
          src={blobUrl}
          controls
          autoPlay={false}
          style={{
            width: config.width ?? '100% ',
            height: config.height ?? 'auto',
          }}
        />
      )
    } else {
      return (
        <iframe
          title={meta.title}
          src={blobUrl}
          style={{ width: '100%', height: 'auto' }}
          height={config.height}
          width={config.width}
          role='document'
        />
      )
    }
  }

  return (
    <>
      <MediaWrapper $height={config.height} $width={config.width}>
        {meta.filetype !== 'application/pdf' && config.showMeta && (
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
      <Popover
        open={showMeta}
        anchorEl={referenceElement.current}
        onClose={() => setShowMeta(false)}
        role='dialog'
      >
        <Popover.Header>
          <Popover.Title>{config.caption ?? 'Meta'}</Popover.Title>
        </Popover.Header>
        <Popover.Content>
          <div className='mb-5'>
            <label className='font-bold text-sm'>Description</label>
            <p>{config.description}</p>
          </div>
          <div className='grid grid-cols-2 font-normal text-xs'>
            <label className='font-bold'>File name:</label>
            <span> {meta.title}</span>
            <label className='font-bold'>Author:</label>
            <span> {meta.author}</span>
            <label className='font-bold'>Filetype:</label>
            <span> {meta.filetype}</span>
            <label className='font-bold'>Filesize:</label>
            <span> {formatBytes(meta.fileSize)}</span>
          </div>
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
            <Button download={meta.title} href={blobUrl} variant='ghost'>
              <Icon size={16} data={download} />
              Download
            </Button>
          </div>
        </Popover.Actions>
      </Popover>
    </>
  )
}
