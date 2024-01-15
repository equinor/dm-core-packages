import React, { PropsWithChildren, useState } from 'react'
import { Icon, Typography } from '@equinor/eds-core-react'
import { IconData, file, file_description } from '@equinor/eds-icons'
import ExpandChevron from '../../components/ExpandChevron'
import { TAttribute } from '@development-framework/dm-core'
import { getDisplayLabel } from '../../utils/getDisplayLabel'
import { TUiAttribute } from '../../types'

const FormTemplate = ({ children }: PropsWithChildren) => {
  return <div className='border border-[#dddddd] rounded-md'>{children}</div>
}

const FormTemplateHeader = ({
  children,
  objectIsNotEmpty = true,
}: PropsWithChildren & { objectIsNotEmpty?: boolean }) => {
  return (
    <legend
      className={`flex h-10 justify-between bg-equinor-lightgray ${
        objectIsNotEmpty ? 'hover:bg-equinor-lightgray' : ''
      } items-center pr-2 rounded-[inherit] transition duration-75`}
      aria-label='object-legend'
    >
      {children}
    </legend>
  )
}

const FormTemplateHeaderActions = ({ children }: PropsWithChildren) => {
  return <div className='flex items-center'>{children}</div>
}

const FormTemplateContent = ({
  children,
  padding,
}: PropsWithChildren & { padding?: string }) => {
  return (
    <div
      className={`border-t border-[#dddddd] ${
        padding ?? 'p-2'
      } max-h-300 overflow-auto w-full`}
    >
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
  uiAttribute,
}: {
  canExpand: boolean | undefined
  canOpen: boolean | undefined
  isExpanded: boolean | undefined
  attribute: TAttribute
  objectIsNotEmpty: boolean
  setIsExpanded?: (expanded: boolean) => void
  onOpen?: () => void
  icon?: IconData
  uiAttribute?: TUiAttribute
}) => {
  const [isHovering, setIsHovering] = useState(false)

  const hideOptional = uiAttribute?.hideOptionalLabel ?? false
  return (
    <div
      className={`flex flex-start items-center w-full h-full ${
        !canExpand ? 'ps-2' : 'ps-1'
      }`}
    >
      {canExpand && (
        <span
          className={`flex w-fit rounded-full items-center ${
            canExpand && isHovering ? 'bg-equinor-lightgreen' : ''
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
          {getDisplayLabel(attribute, true, uiAttribute)}
        </Typography>
        {attribute.optional && !hideOptional && (
          <p className='ps-1 mt-0.5 text-xs'>Optional</p>
        )}
      </div>
    </div>
  )
}

FormTemplate.Header = FormTemplateHeader
FormTemplate.Content = FormTemplateContent

FormTemplateHeader.Title = FormTemplateHeaderTitle
FormTemplateHeader.Actions = FormTemplateHeaderActions

export default FormTemplate
