import { PropsWithChildren } from 'react'
import { ComplexAttributeTemplateContent } from './ComplexAttributeTemplateContent'
import { ComplexAttributeTemplateHeader } from './ComplexAttributeTemplateHeader'

export const ComplexAttributeTemplate = ({ children }: PropsWithChildren) => {
  return (
    <div className='border border-[#dddddd] rounded-md w-full'>{children}</div>
  )
}

ComplexAttributeTemplate.Header = ComplexAttributeTemplateHeader
ComplexAttributeTemplate.Content = ComplexAttributeTemplateContent
