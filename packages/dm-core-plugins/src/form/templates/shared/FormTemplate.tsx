import { TAttribute, colors } from '@development-framework/dm-core'
import { EdsProvider, Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import {
  IconData,
  file,
  file_description,
  info_circle,
} from '@equinor/eds-icons'
import { PropsWithChildren, useState } from 'react'
import ExpandChevron from '../../components/ExpandChevron'
import { TUiAttribute } from '../../types'
import { getDisplayLabel } from '../../utils/getDisplayLabel'

const FormTemplate = ({ children }: PropsWithChildren) => {
  return (
    <div className='border border-[#dddddd] rounded-md w-full'>{children}</div>
  )
}

const FormTemplateHeader = ({
  children,
  objectIsNotEmpty = true,
}: PropsWithChildren & { objectIsNotEmpty?: boolean }) => {
  const classNames = [
    'flex h-10 justify-between bg-equinor-lightgray items-center pr-2 rounded-[inherit] transition duration-75',
  ]
  if (objectIsNotEmpty) {
    // TODO: This bg is the same as the resting state, should it be different?
    classNames.push('hover:bg-equinor-lightgray')
  }
  return <legend className={classNames.join(' ')}>{children}</legend>
}

const FormTemplateHeaderActions = ({
  children,
  uiAttribute,
}: PropsWithChildren & { uiAttribute?: TUiAttribute }) => {
  return (
    <div className='flex items-center'>
      {uiAttribute?.tooltip && (
        <EdsProvider density='compact'>
          <Tooltip title={uiAttribute?.tooltip}>
            <Icon data={info_circle} size={16} color={colors.equinorGreen} />
          </Tooltip>
        </EdsProvider>
      )}
      {children}
    </div>
  )
}

const FormTemplateContent = ({
  children,
  padding,
  expanded,
  canExpand,
}: PropsWithChildren & {
  expanded: boolean
  canExpand: boolean
  padding?: string
}) => {
  return (
    <>
      {canExpand && (
        <div
          className={`border-t border-[#dddddd] ${padding ?? 'p-2'} w-full
      ${expanded ? '' : 'hidden'}
      `}
        >
          {children}
        </div>
      )}
    </>
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
  namePath,
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
  namePath?: string
}) => {
  const [isHovering, setIsHovering] = useState(false)

  const hideOptional = uiAttribute?.hideOptionalLabel ?? false
  return (
    <div
      className={`flex flex-start items-center ${!canExpand ? 'ps-2' : 'ps-1'}`}
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
        className={`flex items-center space-x-1 ${
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
          aria-label={`form-complex-${namePath}`}
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
