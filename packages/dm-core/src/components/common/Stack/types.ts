import React from 'react'

export type AlignDefaultTypes =
	| 'center'
	| 'flex-start'
	| 'flex-end'
	| 'stretch'
	| 'initial'
	| 'inherit'

export type AlignContentTypes =
	| AlignDefaultTypes
	| 'space-between'
	| 'space-around'

export type AlignItemsTypes = AlignDefaultTypes | 'baseline' | 'space-between'

export type AlignSelfTypes = AlignDefaultTypes | 'baseline' | 'auto'

export type JustifyContentTypes =
	| AlignDefaultTypes
	| 'space-between'
	| 'space-around'

export type DirectionTypes = 'row' | 'column' | 'row-reverse' | 'column-reverse'

export interface StackProps extends React.ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode
	spacing?: number
	inline?: boolean
	alignContent?: AlignContentTypes
	alignItems?: AlignItemsTypes
	alignSelf?: AlignSelfTypes
	justifyContent?: JustifyContentTypes
	basis?:
		| 'none'
		| 'auto'
		| 'fill'
		| 'content'
		| 'fit-content'
		| 'min-content'
		| 'max-content'
	grow?: number
	shrink?: number
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
	wrap?: 'initial' | 'no-wrap' | 'wrap' | 'wrap-reverse'
	order?: number
	className?: string
	style?: React.CSSProperties
	padding?: number
	as?: keyof JSX.IntrinsicElements
}

export interface StyledStackProps {
	alignItems?: AlignItemsTypes
	alignContent?: AlignContentTypes
	alignSelf?: AlignSelfTypes
	justifyContent?: JustifyContentTypes
	flexDirection?: DirectionTypes
	flexGrow?: number
	flexShrink?: number
	inline?: boolean
	padding?: number
	spacing?: number
	flexWrap?: 'initial' | 'no-wrap' | 'wrap' | 'wrap-reverse'
}
