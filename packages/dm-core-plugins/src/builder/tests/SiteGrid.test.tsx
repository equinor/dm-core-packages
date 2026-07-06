import {
  DMApplicationProvider,
  type IUIPlugin,
  type TUiPluginMap,
} from '@development-framework/dm-core'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { TGridPluginConfig } from '../../grid/types'
import { GRID_PLUGIN_NAME } from '../model'
import { SiteGrid } from '../components/SiteGrid'

const HeadingStub = (props: IUIPlugin) => (
  <div data-testid='heading'>
    {(props.config as { text?: string })?.text ?? ''}
  </div>
)

const plugins = {
  'test/heading': { component: HeadingStub },
  // Containers render their nested grid recursively, not through this plugin.
  [GRID_PLUGIN_NAME]: {
    component: () => <div data-testid='should-not-render' />,
  },
} as unknown as TUiPluginMap

const wrapper = ({ children }: { children: ReactNode }) => (
  <DMApplicationProvider
    plugins={plugins}
    application={{ name: 'test', type: 'test' }}
    dmJobPath={''}
    enableBlueprintCache
  >
    {children}
  </DMApplicationProvider>
)

const gridWith = (items: TGridPluginConfig['items']): TGridPluginConfig => ({
  size: { columns: 12, rows: 4, rowGap: '8px', columnGap: '8px' },
  items,
  itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '4px' },
  showItemBorders: false,
})

const headingItem = (text: string) => ({
  type: 'dmss://system/Plugins/dm-core-plugins/grid/GridItem',
  gridArea: { rowStart: 1, rowEnd: 1, columnStart: 1, columnEnd: 6 },
  viewConfig: {
    type: 'CORE:InlineRecipeViewConfig',
    scope: '',
    recipe: {
      type: 'CORE:UiRecipe',
      name: 'heading',
      plugin: 'test/heading',
      config: { text },
    },
  },
})

describe('SiteGrid', () => {
  it('renders a self-contained widget directly from its inline config', () => {
    render(
      <SiteGrid
        idReference='dmss://Sites/$site'
        type='dmss://Sites/Website'
        config={gridWith([headingItem('Welcome')])}
      />,
      { wrapper }
    )

    // The plugin renders synchronously with the inline config — no spinner and
    // no DMSS attributeGet that would fail on the free-form config.
    expect(screen.getByTestId('heading').textContent).toBe('Welcome')
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('renders nested section grids recursively', () => {
    const section = {
      type: 'dmss://system/Plugins/dm-core-plugins/grid/GridItem',
      gridArea: { rowStart: 1, rowEnd: 2, columnStart: 1, columnEnd: 12 },
      viewConfig: {
        type: 'CORE:InlineRecipeViewConfig',
        scope: '',
        recipe: {
          type: 'CORE:UiRecipe',
          name: 'section',
          plugin: GRID_PLUGIN_NAME,
          config: gridWith([headingItem('Nested')]),
        },
      },
    }

    render(
      <SiteGrid
        idReference='dmss://Sites/$site'
        type='dmss://Sites/Website'
        config={gridWith([section])}
      />,
      { wrapper }
    )

    expect(screen.getByTestId('heading').textContent).toBe('Nested')
    expect(screen.queryByTestId('should-not-render')).toBeNull()
  })
})
