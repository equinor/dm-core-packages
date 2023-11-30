import React, { ReactElement, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Icon, Popover } from '@equinor/eds-core-react'
import { download, external_link, info_circle } from '@equinor/eds-icons'

import { formatBytes } from '../utils/stringUtilities'

interface MediaContentProps {
	blobUrl: string
	height?: number
	width?: number
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
  max-width: 30rem;
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
	const { blobUrl, meta, height, width } = props
	const [showMeta, setShowMeta] = useState(false)
	const referenceElement = useRef()

	function renderMediaElement(filetype: string) {
		if (filetype.includes('image')) {
			return (
				<img
					src={blobUrl}
					alt={meta.title}
					style={{ width: width ?? '100%', height: height ?? 'auto' }}
				/>
			)
		} else if (filetype.includes('video')) {
			return (
				// biome-ignore lint/a11y/useMediaCaption: No captions for example video
				<video
					src={blobUrl}
					controls
					autoPlay={false}
					style={{ width: width ?? '100% ', height: height ?? 'auto' }}
				/>
			)
		} else {
			return (
				<iframe
					title={meta.title}
					src={blobUrl}
					style={{ width: '100%', height: 'auto' }}
					role='document'
				/>
			)
		}
	}

	return (
		<>
			<MediaWrapper $height={height} $width={width}>
				{meta.filetype !== 'application/pdf' && (
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
					<Popover.Title>Meta</Popover.Title>
				</Popover.Header>
				<Popover.Content>
					<MetaWrapper>
						<label className='meta-label'>File name:</label>
						<span> {meta.title}</span>
						<label className='meta-label'>Author:</label>
						<span> {meta.author}</span>
						<label className='meta-label'>Date:</label>
						<span> {new Date(meta.date).toLocaleDateString()} </span>
						<label className='meta-label'>Filetype:</label>
						<span> {meta.filetype}</span>
						<label className='meta-label'>Filesize:</label>
						<span> {formatBytes(meta.fileSize)}</span>
					</MetaWrapper>
				</Popover.Content>
				<Popover.Actions>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-start',
							width: '100%',
						}}
					>
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
