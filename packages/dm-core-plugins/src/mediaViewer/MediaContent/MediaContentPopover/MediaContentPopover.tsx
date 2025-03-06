import { Button, Icon, Popover } from '@equinor/eds-core-react'
import { download, external_link } from '@equinor/eds-icons'
import { DateTime } from 'luxon'
import type { RefObject } from 'react'
import { Stack } from '../../../common'
import { formatBytes } from '../../../utils'
import { MetaItem } from '../MetaItem/MetaItem'
import type { MediaContentProps } from '../types'
import { isViewableInBrowser } from '../utils'

type MediaContentPopoverProps = {
  isOpen: boolean
  onClose: () => void
  popoverButtonRef: RefObject<HTMLButtonElement | null>
} & Omit<MediaContentProps, 'fetchBlob' | 'downloadFile'>

export const MediaContentPopover = (props: MediaContentPopoverProps) => {
  const { isOpen, onClose, config, meta, blobUrl, popoverButtonRef } = props
  return (
    <Popover
      open={isOpen}
      anchorEl={popoverButtonRef?.current}
      onClose={onClose}
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
              <MetaItem title='File size' value={formatBytes(meta.fileSize)} />
              <MetaItem
                title='Date'
                value={DateTime.fromISO(meta.date.replace(' ', 'T')).toFormat(
                  'dd/MM/yyyy HH:mm'
                )}
              />
            </Stack>
          )}
        </Stack>
      </Popover.Content>
      <Popover.Actions>
        <Stack direction='row' spacing={0.25} fullWidth justifyContent='center'>
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
    </Popover>
  )
}
