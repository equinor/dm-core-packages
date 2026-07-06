import {
  ErrorBoundary,
  useApplication,
  ViewCreator,
} from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import type {
  TGridItem,
  TGridItemStyle,
  TGridPluginConfig,
} from '../../grid/types'
import { ensureModel, GRID_PLUGIN_NAME, isContainerItem } from '../model'

/**
 * Read-only site renderer.
 *
 * The shared grid plugin renders each widget through `ViewCreator`, which calls
 * DMSS `attributeGet` to resolve the target attribute's type. That resolution
 * walks the whole stored document and requires a `type` on every nested object —
 * but the builder's widgets carry free-form inline `config` (e.g. a heading's
 * `{ text, level, align }`) with no blueprint, so DMSS cannot resolve a saved
 * site and every widget spins on `<Loading/>` forever.
 *
 * Self-contained widgets (scope `''`) don't bind to document data, so there is
 * nothing to resolve: we render their plugin directly with the inline config,
 * exactly like `InlineRecipeView` does after `ViewCreator` has resolved the
 * target. Widgets that *do* bind data (non-empty scope) keep the original
 * `ViewCreator` path so their behaviour is unchanged.
 */

const HORIZONTAL_ALIGN: Record<string, React.CSSProperties['alignItems']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}

const VERTICAL_ALIGN: Record<string, React.CSSProperties['justifyContent']> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}

const styleToCss = (style?: TGridItemStyle): React.CSSProperties =>
  style
    ? {
        textAlign: style.textAlign,
        alignItems: style.textAlign
          ? HORIZONTAL_ALIGN[style.textAlign]
          : undefined,
        justifyContent: style.verticalAlign
          ? VERTICAL_ALIGN[style.verticalAlign]
          : undefined,
        fontSize: style.fontSize,
        fontWeight: style.bold ? 700 : undefined,
        color: style.color,
        padding: style.padding,
      }
    : {}

const Grid = styled.div<{ $config: TGridPluginConfig }>`
  display: grid;
  width: 100%;
  height: fit-content;
  grid-template-rows: ${({ $config }) =>
    $config.size.rowSizes
      ? $config.size.rowSizes.join(' ')
      : `repeat(${$config.size.rows}, 1fr)`};
  grid-template-columns: ${({ $config }) =>
    $config.size.columnSizes
      ? $config.size.columnSizes.join(' ')
      : `repeat(${$config.size.columns}, 1fr)`};
  grid-column-gap: ${({ $config }) => $config.size.columnGap};
  grid-row-gap: ${({ $config }) => $config.size.rowGap};
`

const Cell = styled.div<{ $item: TGridItem; $config: TGridPluginConfig }>`
  grid-area: ${({ $item }) =>
    `${$item.gridArea.rowStart} / ${$item.gridArea.columnStart} / ${
      $item.gridArea.rowEnd + 1
    } / ${$item.gridArea.columnEnd + 1}`};
  border: ${({ $config }) =>
    $config.showItemBorders
      ? `${$config.itemBorder.size} ${$config.itemBorder.style} ${$config.itemBorder.color}`
      : undefined};
  border-radius: ${({ $config }) =>
    $config.showItemBorders ? $config.itemBorder.radius : undefined};
  overflow: auto;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
`

type TWidgetProps = {
  item: TGridItem
  idReference: string
  type: string
  onSubmit?: (data: any) => void
  onChange?: (data: any) => void
}

const Widget = ({
  item,
  idReference,
  type,
  onSubmit,
  onChange,
}: TWidgetProps): React.ReactElement => {
  const { getUiPlugin } = useApplication()
  const { viewConfig } = item
  const recipe = viewConfig.recipe

  // Data-bound widgets (non-empty scope) still need DMSS to resolve their
  // target, so keep the original ViewCreator path for them.
  if (
    viewConfig.scope ||
    typeof recipe !== 'object' ||
    recipe === null ||
    !recipe.plugin
  ) {
    return (
      <ViewCreator
        idReference={idReference}
        viewConfig={viewConfig}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  }

  const UiPlugin = getUiPlugin(recipe.plugin)
  return (
    <UiPlugin
      idReference={idReference}
      type={type}
      config={recipe.config ?? {}}
      onSubmit={onSubmit}
      onChange={onChange}
    />
  )
}

export type TSiteGridProps = {
  config: TGridPluginConfig
  idReference: string
  type: string
  onSubmit?: (data: any) => void
  onChange?: (data: any) => void
}

/** Render a grid layout read-only, rendering each widget's plugin directly. */
export const SiteGrid = ({
  config,
  idReference,
  type,
  onSubmit,
  onChange,
}: TSiteGridProps): React.ReactElement => (
  <Grid className='dm-plugin-padding' $config={config}>
    {config.items.map((item, index) => (
      <Cell key={`item-${index}`} $item={item} $config={config}>
        {item.title && (
          <Typography variant='h4' style={styleToCss(item.titleStyle)}>
            {item.title}
          </Typography>
        )}
        <Content style={styleToCss(item.style)}>
          <ErrorBoundary message='A widget could not render.'>
            {isContainerItem(item) &&
            item.viewConfig.recipe &&
            typeof item.viewConfig.recipe === 'object' &&
            item.viewConfig.recipe.plugin === GRID_PLUGIN_NAME ? (
              <SiteGrid
                config={ensureModel(item.viewConfig.recipe.config)}
                idReference={idReference}
                type={type}
                onSubmit={onSubmit}
                onChange={onChange}
              />
            ) : (
              <Widget
                item={item}
                idReference={idReference}
                type={type}
                onSubmit={onSubmit}
                onChange={onChange}
              />
            )}
          </ErrorBoundary>
        </Content>
      </Cell>
    ))}
  </Grid>
)
