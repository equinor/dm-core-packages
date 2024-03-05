import React from 'react'

type ComplexAttributeTemplateContentProps = {
  children: React.ReactNode
  expanded: boolean
  canExpand: boolean
  padding?: string
}

export const ComplexAttributeTemplateContent = ({
  children,
  padding,
  expanded,
  canExpand,
}: ComplexAttributeTemplateContentProps) => {
  return (
    <>
      {canExpand && (
        <div
          className={`border-t border-[#dddddd] ${padding ?? 'p-2'} w-full ${
            expanded ? '' : 'hidden'
          }`}
        >
          {children}
        </div>
      )}
    </>
  )
}
