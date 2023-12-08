import React from 'react'
import ExpandChevron from './ExpandChevron'
import { TAttribute } from '@development-framework/dm-core'
import { Icon, Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../../utils/getDisplayLabel'
import { file, file_description } from '@equinor/eds-icons'

const ObjectLegendHeader = ({
  canExpand,
  isExpanded,
  setIsExpanded,
  attribute,
  openInTab,
  referenceExists,
}: {
  canExpand: boolean | undefined
  isExpanded: boolean | undefined
  attribute: TAttribute
  referenceExists: boolean
  setIsExpanded: (expanded: boolean) => void
  openInTab: () => void
}) => {
  return (
    <div
      className={`flex flex-start items-center ${!canExpand ? 'ps-2' : 'ps-1'}`}
    >
      {canExpand && (
        <ExpandChevron
          isExpanded={isExpanded ?? false}
          setIsExpanded={setIsExpanded}
        />
      )}
      <div
        className={`flex items-center space-x-1  ${
          referenceExists ? 'cursor-pointer' : 'opacity-50'
        }
    `}
        onClick={() => {
          if (!referenceExists) return
          canExpand ? setIsExpanded(!isExpanded) : openInTab()
        }}
      >
        <Icon
          data={referenceExists ? file_description : file}
          color='#3d3d3d'
        />
        <Typography
          bold={true}
          className={referenceExists && !canExpand ? 'hover:underline' : ''}
        >
          {getDisplayLabel(attribute)}
        </Typography>
        {attribute.optional && <p className='ps-1 text-xs'>Optional</p>}
      </div>
    </div>
  )
}

export default ObjectLegendHeader
