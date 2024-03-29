import { Button, Icon, Popover } from '@equinor/eds-core-react'
import { download, external_link, info_circle } from '@equinor/eds-icons'
import { ReactElement, useRef, useState } from 'react'

import { DateTime } from 'luxon'
import { createPortal } from 'react-dom'
import { createSyntheticFileDownload, formatBytes } from '../../utils'
import { MediaWrapper, MetaPopoverButton } from './styles'
import { MediaContentProps } from './types'
import { isViewableInBrowser } from './utils'

export const MediaContent = (props: MediaContentProps): ReactElement => {
  const { blobUrl, getBlobUrl, meta, config } = props
  const [showInfoPopover, setShowInfoPopover] = useState(false)
  const referenceElement = useRef()

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
            width: config.width ?? '100%',
            height: config.height ?? 'auto',
            maxWidth: 'unset',
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
          <Button onClick={downloadFile}>
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
            role='dialog'
            style={{
              overflow: 'auto',
              maxWidth: '100vw',
            }}
          >
            <Popover.Header>
              <Popover.Title>{config.caption ?? meta?.title}</Popover.Title>
            </Popover.Header>
            <Popover.Content>
              {config.showDescription && config.description && (
                <div className='mb-5'>
                  <label className='font-bold text-sm'>Description</label>
                  <p>{config.description}</p>
                </div>
              )}
              {config.showMeta && (
                <div className='grid grid-cols-2 font-normal text-xs'>
                  <label className='font-bold'>File name:</label>
                  <span>
                    {' '}
                    {meta.title}.{meta.filetype}
                  </span>
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
                {isViewableInBrowser(meta.contentType) && (
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
                )}
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
