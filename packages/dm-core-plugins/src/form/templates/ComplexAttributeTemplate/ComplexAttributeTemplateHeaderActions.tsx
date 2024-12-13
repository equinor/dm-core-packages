import { EdsProvider, Icon, Tooltip } from '@equinor/eds-core-react'
import { info_circle } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { Stack } from '../../../common'
import type { TUiAttribute } from '../../types'

export const ComplexAttributeTemplateHeaderActions = ({
  children,
  uiAttribute,
}: { children?: React.ReactNode; uiAttribute?: TUiAttribute }) => {
  return (
    <Stack direction='row' alignItems='center'>
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
    </Stack>
  )
}
