import React, { PropsWithChildren } from 'react'

const ObjectLegendWrapper = ({ children }: PropsWithChildren) => {
  return (
    <legend
      className={`flex h-10 justify-between bg-[#f7f7f7] items-center pr-2`}
    >
      {children}
    </legend>
  )
}

export default ObjectLegendWrapper
