import React from 'react'
import { IUIPlugin, Loading } from '@development-framework/dm-core'
import { TViewSelectorConfig } from './types'
import { useViewSelector } from './useViewSelector'
import { Sidebar } from './Sidebar'
import { Content } from './Content'

export const SidebarPlugin = (
	props: IUIPlugin & { config?: TViewSelectorConfig }
): React.ReactElement => {
	const { idReference, config, type } = props

	const {
		addView,
		isLoading,
		error,
		viewSelectorItems,
		selectedViewId,
		formData,
		setSelectedViewId,
		setFormData,
	} = useViewSelector(idReference, config)

	if (error) {
		throw new Error(JSON.stringify(error, null, 2))
	}
	if (isLoading || !viewSelectorItems.length || !selectedViewId) {
		return <Loading />
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
			}}
		>
			<Sidebar
				viewSelectorItems={viewSelectorItems}
				selectedViewId={selectedViewId}
				setSelectedViewId={setSelectedViewId}
				addView={addView}
			/>
			<div
				style={{
					paddingLeft: '8px',
					paddingRight: '8px',
					width: '100%',
					marginRight: '.5rem',
				}}
			>
				<Content
					style={{
						paddingLeft: '8px',
						paddingRight: '8px',
						width: '100%',
					}}
					type={type}
					onOpen={addView}
					formData={formData}
					selectedViewId={selectedViewId}
					viewSelectorItems={viewSelectorItems}
					setFormData={setFormData}
				/>
			</div>
		</div>
	)
}
