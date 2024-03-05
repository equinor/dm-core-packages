import { EdsProvider, Icon, Tooltip } from '@equinor/eds-core-react'
import { info_circle } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import React from 'react'
import { TUiAttribute } from '../../types'

export const ComplexAttributeTemplateHeaderActions = ({
  children,
  uiAttribute,
}: { children?: React.ReactNode; uiAttribute?: TUiAttribute }) => {
  return (
    <div className='flex items-center'>
      {uiAttribute?.tooltip && (
        <EdsProvider density='compact'>
          <Tooltip title={uiAttribute?.tooltip}>
            <Icon
              data={info_circle}
              size={16}
              color={tokens.colors.interactive.primary__resting.hex}
            />
          </Tooltip>
        </EdsProvider>
      )}
      {children}
    </div>
  )
}
