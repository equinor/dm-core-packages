import React, { useState } from 'react'
import ExpandChevron from './ExpandChevron'
import { TAttribute } from '@development-framework/dm-core'
import { Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../../utils/getDisplayLabel'
import { IconData, file, file_description } from '@equinor/eds-icons'

const ObjectLegendHeader = ({
  canExpand,
  canOpenInTab,
  isExpanded,
  setIsExpanded,
  attribute,
  openInTab,
  objectIsNotEmpty,
  icon,
}: {
  canExpand: boolean | undefined
  canOpenInTab: boolean | undefined
  isExpanded: boolean | undefined
  attribute: TAttribute
  objectIsNotEmpty: boolean
  setIsExpanded?: (expanded: boolean) => void
  openInTab?: () => void
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
          ${
            objectIsNotEmpty && (canOpenInTab || canExpand)
              ? 'cursor-pointer'
              : ''
          }
          ${canOpenInTab ? 'hover:underline' : ''}`}
          onClick={() => {
            if (!objectIsNotEmpty) return
            if (canOpenInTab) {
              openInTab?.()
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

export default ObjectLegendHeader
