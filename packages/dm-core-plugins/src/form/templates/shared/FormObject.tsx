import React, { PropsWithChildren } from 'react'
import { Icon, Typography } from '@equinor/eds-core-react'
import { IconData, file, file_description } from '@equinor/eds-icons'
import ExpandChevron from '../../components/ExpandChevron'
import { TAttribute } from '@development-framework/dm-core'
import { getDisplayLabel } from '../../utils/getDisplayLabel'

const FormObject = ({ children }: PropsWithChildren) => {
  return <div className='border border-[#6f6f6f] rounded-sm'>{children}</div>
}

const FormObjectLegend = ({ children }: PropsWithChildren) => {
  return (
    <legend
      className={`flex h-10 justify-between bg-[#f7f7f7] items-center pr-2 rounded-[inherit]`}
      aria-label='object-legend'
    >
      {children}
    </legend>
  )
}

const FormObjectLegendActions = ({ children }: PropsWithChildren) => {
  return <div className='flex items-center'>{children}</div>
}

const FormObjectExpandedView = ({ children }: PropsWithChildren) => {
  return (
    <div className='border-t p-2 border-[#6f6f6f] overflow-auto w-full'>
      {children}
    </div>
  )
}

const FormObjectLegendHeader = ({
  canExpand,
  canOpen,
  isExpanded,
  setIsExpanded,
  attribute,
  onOpen,
  objectIsNotEmpty,
  icon,
}: {
  canExpand: boolean | undefined
  canOpen: boolean | undefined
  isExpanded: boolean | undefined
  attribute: TAttribute
  objectIsNotEmpty: boolean
  setIsExpanded?: (expanded: boolean) => void
  onOpen?: () => void
  icon?: IconData
}) => {
  return (
    <div
      className={`flex flex-start items-center ${!canExpand ? 'ps-2' : 'ps-1'}`}
    >
      {canExpand && (
        <ExpandChevron
          isExpanded={isExpanded ?? false}
          setIsExpanded={(exp) => setIsExpanded?.(exp)}
        />
      )}
      <div
        className={`flex items-center space-x-1 ${
          objectIsNotEmpty ? '' : 'opacity-40'
        }
    `}
      >
        <Icon
          data={icon ?? (objectIsNotEmpty ? file_description : file)}
          color='#3d3d3d'
        />
        <Typography
          bold={true}
          className={`
          ${objectIsNotEmpty && (canOpen || canExpand) ? 'cursor-pointer' : ''}
          ${canOpen ? 'hover:underline' : ''}`}
          onClick={() => {
            if (!objectIsNotEmpty) return
            if (canOpen) {
              onOpen?.()
              return
            }
            canExpand && setIsExpanded?.(!isExpanded)
          }}
        >
          {getDisplayLabel(attribute)}
        </Typography>
        {attribute.optional && <p className='ps-1 text-xs'>Optional</p>}
      </div>
    </div>
  )
}

FormObject.Legend = FormObjectLegend
FormObject.ExpandedView = FormObjectExpandedView

FormObjectLegend.Header = FormObjectLegendHeader
FormObjectLegend.Actions = FormObjectLegendActions

export default FormObject
