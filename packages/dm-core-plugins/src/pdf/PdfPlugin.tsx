import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import {
	IUIPlugin,
	Loading,
	splitAddress,
	TGenericObject,
	useDocument,
} from '@development-framework/dm-core'

export const PdfPlugin = (props: IUIPlugin) => {
	const { idReference } = props
	const { document, isLoading, error } = useDocument<TGenericObject>(
		idReference,
		999
	)
	const { dataSource } = splitAddress(idReference)

	if (error) throw new Error(JSON.stringify(error, null, 2))
	if (isLoading || document === null) return <Loading />

	return <ViewerPDFPlugin document={document} dataSourceId={dataSource} />
}
