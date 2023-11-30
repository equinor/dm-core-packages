import React, { Suspense, useEffect, useState } from 'react'
import {
	EBlueprint,
	ErrorResponse,
	IUIPlugin,
	Loading,
	MediaContent,
	splitAddress,
	useDMSS,
	useDocument,
} from '@development-framework/dm-core'
import { AxiosError, AxiosRequestConfig } from 'axios'

interface MediaObject {
	type: string
	_id: string
	name: string
	author: string
	date: string
	size: number
	filetype: string
	content: {
		type: string
		referenceType: string
		address: string
	}
}

export const MediaViewerPlugin = (props: IUIPlugin): React.ReactElement => {
	const { idReference } = props
	const [blobUrl, setBlobUrl] = useState<string>()
	const dmssAPI = useDMSS()
	const {
		document,
		isLoading,
		error: documentError,
	} = useDocument<MediaObject>(idReference, 999)
	const { dataSource } = splitAddress(idReference)
	const options: AxiosRequestConfig = { responseType: 'blob' }
	useEffect(() => {
		if (document?.content?.address)
			dmssAPI
				.blobGetById(
					{
						dataSourceId: dataSource,
						blobId: document?.content?.address.slice(1),
					},
					options
				)
				.then((response: any) => {
					const blob = new Blob([response.data], {
						type: document.filetype,
					})
					setBlobUrl(window.URL.createObjectURL(blob))
				})
				.catch((error: AxiosError<ErrorResponse>) => {
					console.error(error)
				})
	}, [document])

	if (documentError) throw new Error(JSON.stringify(documentError, null, 2))
	if (isLoading || document === null) return <Loading />
	if (document.type !== EBlueprint.FILE) throw new Error('This is not a file')
	return (
		<Suspense fallback={<Loading />}>
			{blobUrl ? (
				<MediaContent
					blobUrl={blobUrl}
					meta={{
						author: document.author,
						fileSize: document.size,
						title: document.name,
						filetype: document.filetype,
						date: document.date,
					}}
				/>
			) : (
				<p>Media not found</p>
			)}
		</Suspense>
	)
}
