import React, { PropsWithChildren } from 'react'

const FormExpandedVewWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className='border-t p-2 border-[#6f6f6f] overflow-scroll'>
      {children}
    </div>
  )
}

export default FormExpandedVewWrapper
