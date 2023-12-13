import React from 'react'

interface ReadOnlyFieldProps {
  label?: string
  value?: string | number
  helperText?: string
  unit?: string
}

const ReadOnlyField = ({
  label,
  value,
  helperText,
  unit,
}: ReadOnlyFieldProps) => {
  return (
    <>
      <p className='text-xs ms-2 text-[#6f6f6f] font-medium'>{label}</p>
      <div className='bg-[#f7f7f7] p-2 rounded-sm h-9 flex items-center justify-between'>
        <p aria-label={'readonly-' + label}>{value}</p>
        <p className='text-xs text-[#6f6f6f] font-medium'>{unit}</p>
      </div>
      <p className='text-xs ms-2 mt-2 font-medium text-[#6f6f6f]'>
        {helperText}
      </p>
    </>
  )
}

export default ReadOnlyField
