import {
  type IUIPlugin,
  Loading,
  type TApplication,
  type TUiRecipe,
  useApplication,
  useBlueprint,
  useDocument,
} from '@development-framework/dm-core'
import { TopBar } from '@equinor/eds-core-react'
import { useEffect, useMemo, useState } from 'react'
import { Stack } from '../common'
import { AboutDialog } from './components/AboutDialog'
import { AdminMenu } from './components/AdminMenu'
import { AppSelector } from './components/AppSelector'
import { UserInfoDialog } from './components/UserInfoDialog'
import * as S from './HeaderPlugin.styles'
import {
  defaultHeaderPluginConfig,
  type THeaderPluginConfig,
  type TRecipeConfigAndPlugin,
  type UIRecipeItem,
} from './HeaderPlugin.types'
import { getRecipeConfigAndPlugin } from './HeaderPlugin.utils'

/**
 * Component which renders a header.
 *
 * @docs Plugins
 * @scope HeaderPlugin
 *
 * @param {THeaderPluginConfig} props {@link THeaderPluginConfig} *
 */

export default (props: IUIPlugin): React.ReactElement => {
  const { idReference, config: passedConfig, type } = props
  const config: THeaderPluginConfig = {
    ...defaultHeaderPluginConfig,
    ...passedConfig,
  }

  const { document: entity, isLoading } = useDocument<TApplication>(idReference)
  const { uiRecipes, isLoading: isBlueprintLoading } = useBlueprint(type)
  const { getUiPlugin, roles } = useApplication()
  const [selectedRecipe, setSelectedRecipe] = useState<TRecipeConfigAndPlugin>({
    component: () => <div />,
    config: {},
    name: '',
  })

  useEffect(() => {
    if (!isBlueprintLoading) {
      const defaultRecipe: TUiRecipe = config.uiRecipesList.length
        ? uiRecipes.find(
            (recipe: TUiRecipe) =>
              recipe.name === config.uiRecipesList[0]?.recipeName
          )
        : uiRecipes[0]
      setSelectedRecipe(
        getRecipeConfigAndPlugin(defaultRecipe?.name, uiRecipes, getUiPlugin)
      )
    }
  }, [isBlueprintLoading, config.uiRecipesList, uiRecipes])

  const UIPlugin: (props: IUIPlugin) => React.ReactElement =
    selectedRecipe.component

  const recipes: UIRecipeItem[] | TUiRecipe[] = useMemo(
    () => (config.uiRecipesList.length > 0 ? config.uiRecipesList : uiRecipes),
    [config.uiRecipesList, uiRecipes]
  )

  if (isLoading || !entity || isBlueprintLoading) {
    return <Loading />
  }

  return (
    <Stack fullWidth grow={1} minHeight={0}>
      <TopBar style={{ width: '100%', flexShrink: 0 }}>
        <TopBar.Header>
          <S.Logo data-testid='application-label'>{entity.label}</S.Logo>
          <AppSelector
            isLoading={isBlueprintLoading}
            items={recipes}
            onSelectItem={(item) => {
              const newSelectedRecipe = getRecipeConfigAndPlugin(
                item,
                uiRecipes,
                getUiPlugin
              )
              setSelectedRecipe(newSelectedRecipe)
            }}
            currentItem={selectedRecipe.name}
          />
        </TopBar.Header>
        <TopBar.Actions>
          <Stack direction='row' alignItems='center' spacing={2}>
            {!config.hideUserInfo && (
              <UserInfoDialog applicationEntity={entity} />
            )}
            {!config.hideAbout && <AboutDialog applicationEntity={entity} />}
            {config.adminRole &&
              roles.map((r) => r.name).includes(config.adminRole) && (
                <AdminMenu />
              )}
          </Stack>
        </TopBar.Actions>
      </TopBar>
      <Stack fullWidth grow={1} minHeight={0}>
        <UIPlugin
          key={idReference + selectedRecipe.name}
          idReference={idReference}
          type={entity.type}
          config={selectedRecipe.config}
        />
      </Stack>
    </Stack>
  )
}
