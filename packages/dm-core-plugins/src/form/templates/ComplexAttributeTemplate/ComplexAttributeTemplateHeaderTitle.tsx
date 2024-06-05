import { TAttribute } from '@development-framework/dm-core'
import { Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import {
  IconData,
  chevron_right,
  file,
  file_description,
} from '@equinor/eds-icons'
import { Stack } from '../../../common'
import { TUiAttribute } from '../../types'
import { getDisplayLabel } from '../../utils'
import { TitleButton } from './styles'

type ComplexAttributeTemplateHeaderTitleProps = {
  canExpand: boolean | undefined
  canOpen: boolean | undefined
  isExpanded: boolean | undefined
  attribute: TAttribute
  objectIsNotEmpty: boolean
  setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>
  onOpen?: () => void
  icon?: IconData
  uiAttribute?: TUiAttribute
  namePath?: string
}

export const ComplexAttributeTemplateHeaderTitle = (
  props: ComplexAttributeTemplateHeaderTitleProps
) => {
  const {
    canExpand,
    canOpen,
    isExpanded,
    setIsExpanded,
    attribute,
    onOpen,
    objectIsNotEmpty,
    uiAttribute,
  } = props

  const hideOptional = uiAttribute?.hideOptionalLabel ?? false
  const displayLabel = getDisplayLabel(attribute, true, uiAttribute)

  function handleLabelClick() {
    if (canExpand) {
      setIsExpanded?.(!isExpanded)
      return
    }
    canOpen && onOpen?.()
  }

  const getTooltipTitle: () => string = () => {
    if (!objectIsNotEmpty) return `Create ${displayLabel} before opening it`
    if (canExpand && isExpanded) return `Collapse ${displayLabel}`
    if (canExpand && !isExpanded) return `Expand ${displayLabel}`
    if (canOpen) return `Open ${displayLabel} in new tab`
    return ''
  }

  const tooltipTitle = getTooltipTitle()

  return (
    <Stack
      direction='row'
      alignItems='center'
      padding={canExpand ? [0, 0.25] : [0, 0.5]}
      fullWidth
    >
      <Tooltip title={tooltipTitle}>
        <TitleButton
          aria-expanded={isExpanded}
          aria-controls={`${props.namePath}-content`}
          onClick={handleLabelClick}
          disabled={!objectIsNotEmpty}
          isExpanded={!!isExpanded}
        >
          {canExpand && setIsExpanded && (
            <span className='title-chevron'>
              <Icon data={chevron_right} />
            </span>
          )}
          <Icon
            className='title-icon'
            data={props.icon ?? (objectIsNotEmpty ? file_description : file)}
            color='#3d3d3d'
          />
          <Typography bold={true}>{displayLabel}</Typography>
          {attribute.optional && !hideOptional && (
            <Typography variant='meta'>Optional</Typography>
          )}
        </TitleButton>
      </Tooltip>
    </Stack>
  )
}
