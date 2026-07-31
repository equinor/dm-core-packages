import { Button, Icon, Typography } from '@equinor/eds-core-react'
import type { TGridItem } from '../../grid/types'
import { getBlock } from '../model/blocks'
import { isContainerItem } from '../model/model'
import * as Styled from '../styles'
import { ICONS } from '../utils/icons'

const itemLabel = (item: TGridItem): string => {
  const recipe = item.viewConfig.recipe
  const blockId = typeof recipe === 'string' ? recipe : recipe?.name
  const block = getBlock(String(blockId))
  return item.title ?? item.viewConfig.label ?? block?.label ?? 'Widget'
}

const itemIcon = (item: TGridItem): string => {
  const recipe = item.viewConfig.recipe
  const blockId = typeof recipe === 'string' ? recipe : recipe?.name
  return getBlock(String(blockId))?.icon ?? 'view_module'
}

/**
 * A flat list of the widgets in the grid currently being edited. Clicking a row
 * selects that widget; container widgets can be opened to drill into their
 * nested grid (mirroring the canvas and breadcrumb).
 */
export const Outline = ({
  items,
  selectedIndex,
  onSelect,
  onEnter,
}: {
  items: TGridItem[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onEnter: (index: number) => void
}): React.ReactElement => {
  return (
    <Styled.OutlinePanel>
      <Typography variant='h6'>Outline</Typography>
      {items.length === 0 ? (
        <Styled.OutlineEmpty>No widgets on this page yet.</Styled.OutlineEmpty>
      ) : (
        <Styled.OutlineList>
          {items.map((item, index) => {
            const container = isContainerItem(item)
            const recipe = item.viewConfig.recipe
            const childCount =
              container && typeof recipe === 'object'
                ? (recipe?.config?.items?.length ?? 0)
                : 0
            return (
              <Styled.OutlineRow
                key={index}
                $selected={selectedIndex === index}
                onClick={() => onSelect(index)}
              >
                <Icon data={ICONS[itemIcon(item)]} size={16} />
                <Styled.OutlineLabel>{itemLabel(item)}</Styled.OutlineLabel>
                {container && (
                  <>
                    <Styled.OutlineCount>{childCount}</Styled.OutlineCount>
                    <Button
                      variant='ghost_icon'
                      aria-label='Open section'
                      onClick={(event) => {
                        event.stopPropagation()
                        onEnter(index)
                      }}
                    >
                      <Icon data={ICONS.chevron_right} size={16} />
                    </Button>
                  </>
                )}
              </Styled.OutlineRow>
            )
          })}
        </Styled.OutlineList>
      )}
    </Styled.OutlinePanel>
  )
}
