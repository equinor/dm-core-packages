import React from 'react'
import { ComplexAttributeTemplateHeaderActions } from './ComplexAttributeTemplateHeaderActions'
import { ComplexAttributeTemplateHeaderTitle } from './ComplexAttributeTemplateHeaderTitle'

export const ComplexAttributeTemplateHeader = ({
  children,
  objectIsNotEmpty = true,
}: { children: React.ReactNode; objectIsNotEmpty?: boolean }) => {
  return (
    <legend className='flex h-10 justify-between bg-equinor-lightgray items-center pr-2 rounded-[inherit] transition duration-75'>
      {children}
    </legend>
  )
}

ComplexAttributeTemplateHeader.Title = ComplexAttributeTemplateHeaderTitle
ComplexAttributeTemplateHeader.Actions = ComplexAttributeTemplateHeaderActions
