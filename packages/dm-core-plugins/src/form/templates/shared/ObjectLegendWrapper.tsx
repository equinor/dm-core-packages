import React, { PropsWithChildren } from 'react'

const ObjectLegendWrapper = ({ children }: PropsWithChildren) => {
  return (
    <legend
      className={`flex h-10 justify-between bg-[#f7f7f7] items-center pr-2 rounded-[inherit]`}
      aria-label='object-legend'
    >
      {children}
    </legend>
  )
}

export default ObjectLegendWrapper
