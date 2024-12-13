import type { PropsWithChildren } from 'react'
import { ComplexAttributeTemplateHeaderActions } from './ComplexAttributeTemplateHeaderActions'
import { ComplexAttributeTemplateHeaderTitle } from './ComplexAttributeTemplateHeaderTitle'
import * as Styled from './styles'

export const ComplexAttributeTemplate = (props: PropsWithChildren) => (
  <Styled.ComplexAttributeTemplate {...props} />
)

export const ComplexAttributeTemplateHeader = (props: PropsWithChildren) => (
  <Styled.ComplexAttributeTemplateHeader {...props} />
)

export const ComplexAttributeTemplateContent = (
  props: PropsWithChildren & Styled.TComplexAttributeTemplateContent
) => <Styled.ComplexAttributeTemplateContent {...props} />

ComplexAttributeTemplate.Header = ComplexAttributeTemplateHeader
ComplexAttributeTemplate.Content = ComplexAttributeTemplateContent
ComplexAttributeTemplateHeader.Title = ComplexAttributeTemplateHeaderTitle
ComplexAttributeTemplateHeader.Actions = ComplexAttributeTemplateHeaderActions
