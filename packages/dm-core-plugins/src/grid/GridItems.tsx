import { TValidEntity } from '@development-framework/dm-core'
import { GridElement } from './GridElement'
import { TGridItem, TItemBorder } from './types'

type GridItemsProps = {
  items: TGridItem[]
  idReference: string
  type: string
  itemBorder: TItemBorder
  showItemBorders: boolean
  onSubmit?: (data: any) => void
  onChange?: (data: any) => void
  entity?: TValidEntity
}

export const GridItems = (props: GridItemsProps) => {
  const {
    idReference,
    items,
    type,
    itemBorder,
    showItemBorders,
    onChange,
    onSubmit,
    entity,
  } = props
  const elements = items.map((item: TGridItem, index) => {
    return (
      <GridElement
        entity={entity}
        key={`${idReference}-${index}`}
        idReference={idReference}
        item={item}
        type={type}
        itemBorder={itemBorder}
        showItemBorders={showItemBorders}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  })
  return <>{elements}</>
}
