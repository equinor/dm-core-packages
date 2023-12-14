import React, { PropsWithChildren, useState } from 'react'
import { Icon, Typography } from '@equinor/eds-core-react'
import { IconData, file, file_description } from '@equinor/eds-icons'
import ExpandChevron from '../../components/ExpandChevron'
import { TAttribute, useSearch } from '@development-framework/dm-core'
import { getDisplayLabel } from '../../utils/getDisplayLabel'

const FormTemplate = ({ children }: PropsWithChildren) => {
  return <div className='border border-[#6f6f6f] rounded-sm'>{children}</div>
}

const FormTemplateHeader = ({ children }: PropsWithChildren) => {
  return (
    <legend
      className={`flex h-10 justify-between bg-[#f7f7f7] items-center pr-2 rounded-[inherit]`}
      aria-label='object-legend'
    >
      {children}
    </legend>
  )
}

const FormTemplateHeaderActions = ({ children }: PropsWithChildren) => {
  return <div className='flex items-center'>{children}</div>
}

const FormTemplateContent = ({ children }: PropsWithChildren) => {
  return (
    <div className='border-t border-[#6f6f6f] p-2 max-h-300 overflow-auto w-full'>
      {children}
    </div>
  )
}

const FormTemplateHeaderTitle = ({
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
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className={`flex flex-start items-center w-full h-full ${
        !canExpand ? 'ps-2' : 'ps-1'
      }`}
    >
      {canExpand && (
        <span
          className={`flex w-fit rounded-full items-center ${
            canExpand && isHovering ? 'bg-[#deedee] ' : ''
          }`}
        >
          <ExpandChevron
            isExpanded={isExpanded ?? false}
            setIsExpanded={(exp) => setIsExpanded?.(exp)}
          />
        </span>
      )}
      <div
        className={`flex items-center space-x-1 w-full h-full ${
          objectIsNotEmpty ? '' : 'opacity-40'
        }
        ${
          objectIsNotEmpty && (canOpen || canExpand)
            ? 'cursor-pointer hover:opacity-80'
            : ''
        }
    `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={(event) => {
          if (!objectIsNotEmpty) return
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            canOpen && onOpen?.()
            return
          }
          if (canExpand) {
            setIsExpanded?.(!isExpanded)
            return
          }
          canOpen && onOpen?.()
        }}
      >
        <Icon
          data={icon ?? (objectIsNotEmpty ? file_description : file)}
          color='#3d3d3d'
        />
        <Typography
          bold={true}
          className={`
          ${
            objectIsNotEmpty && isHovering && canOpen && !canExpand
              ? 'underline'
              : ''
          }`}
        >
          {getDisplayLabel(attribute)}
        </Typography>
        {attribute.optional && <p className='ps-1 mt-0.5 text-xs'>Optional</p>}
      </div>
    </div>
  )
}

FormTemplate.Header = FormTemplateHeader
FormTemplate.Content = FormTemplateContent

FormTemplateHeader.Title = FormTemplateHeaderTitle
FormTemplateHeader.Actions = FormTemplateHeaderActions

export default FormTemplate
