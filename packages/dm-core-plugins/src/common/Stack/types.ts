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

export type SpacingType =
  | number
  | [y: number, x: number]
  | [top: number, right: number, bottom: number, left: number]

export interface StackProps extends React.ComponentPropsWithRef<'div'> {
  children?: React.ReactNode
  spacing?: number
  inline?: boolean
  alignContent?: AlignContentTypes
  alignItems?: AlignItemsTypes
  alignSelf?: AlignSelfTypes
  justifyContent?: JustifyContentTypes
  grow?: number
  shrink?: number
  direction?: DirectionTypes
  wrap?: 'initial' | 'no-wrap' | 'wrap' | 'wrap-reverse'
  className?: string
  style?: React.CSSProperties
  padding?: SpacingType
  margin?: SpacingType
  fullWidth?: boolean
  fullHeight?: boolean
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  minHeight?: number
  scrollY?: boolean
  scrollX?: boolean
  as?: keyof JSX.IntrinsicElements
}

export const defaultProps: StackProps = {
  direction: 'column',
  alignContent: 'initial',
  alignItems: 'initial',
  alignSelf: 'initial',
  justifyContent: 'initial',
  wrap: 'initial',
  padding: 0,
  margin: 0,
  grow: 0,
  shrink: 1,
  fullWidth: false,
  spacing: 0,
}
