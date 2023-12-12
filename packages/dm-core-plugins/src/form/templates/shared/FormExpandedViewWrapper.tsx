import React, { PropsWithChildren } from 'react'

const FormExpandedViewWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className='border-t p-2 border-[#6f6f6f] overflow-auto w-full'>
      {children}
    </div>
  )
}

export default FormExpandedViewWrapper
