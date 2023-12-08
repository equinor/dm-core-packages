import React, { PropsWithChildren } from 'react'

const ObjectWrapper = ({ children }: PropsWithChildren) => {
  return <div className='border border-[#6f6f6f]'>{children}</div>
}

export default ObjectWrapper
