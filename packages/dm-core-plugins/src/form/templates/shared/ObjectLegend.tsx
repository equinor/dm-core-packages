import React, { PropsWithChildren } from 'react'

const Legend = ({
  children,
  isExpandable,
}: PropsWithChildren & { isExpandable: boolean }) => {
  return (
    <legend
      className={`flex h-10 justify-between bg-[#f7f7f7] ${
        !isExpandable ? 'ps-2' : 'ps-1'
      }`}
    >
      {children}
    </legend>
  )
}

export default Legend
