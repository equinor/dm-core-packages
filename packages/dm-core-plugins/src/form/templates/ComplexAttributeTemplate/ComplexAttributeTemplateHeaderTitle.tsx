import { TAttribute } from '@development-framework/dm-core'
import { Icon, Typography } from '@equinor/eds-core-react'
import { IconData, file, file_description } from '@equinor/eds-icons'
import { useState } from 'react'
import ExpandChevron from '../../components/ExpandChevron'
import { TUiAttribute } from '../../types'
import { getDisplayLabel } from '../../utils'

type ComplexAttributeTemplateHeaderTitleProps = {
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
}

export const ComplexAttributeTemplateHeaderTitle = ({
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
}: ComplexAttributeTemplateHeaderTitleProps) => {
  const [isHovering, setIsHovering] = useState(false)

  const hideOptional = uiAttribute?.hideOptionalLabel ?? false

  function handleLabelClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
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
  }

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
        onClick={handleLabelClick}
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
