import React, { PropsWithChildren } from 'react'

const FormObjectBorder = ({ children }: PropsWithChildren) => {
  return <div className='border border-[#6f6f6f] rounded-sm'>{children}</div>
}

export default FormObjectBorder
