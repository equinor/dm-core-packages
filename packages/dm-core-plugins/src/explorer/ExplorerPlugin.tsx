import {
  EBlueprint,
  EntityView,
  TNodeWrapperProps,
  TreeNode,
  TreeView,
  useApplication,
} from '@development-framework/dm-core'
import { Progress } from '@equinor/eds-core-react'
import { useCallback, useState } from 'react'
import Sidebar from './components/Sidebar'
import NodeRightClickMenu from './components/context-menu/NodeRightClickMenu'
import { default_raw_view_ui_recipe_config } from './constants'

export default () => {
  const { treeNodes, loading } = useApplication()
  const [selectedType, setSelectedType] = useState<string>()
  const [asRawView, setAsRawView] = useState<boolean>(false)
  const [selectedEntity, setSelectedEntity] = useState<string>()
  const [nodeDimensions, setNodeDimensions] = useState<string | undefined>(
    undefined
  )
  const setRawView = (type: string, id: string) => {
    setSelectedEntity(id)
    setSelectedType(type)
    setAsRawView(true)
  }
  const nodeWrapper = useCallback(
    (props: TNodeWrapperProps) =>
      NodeRightClickMenu({ ...props, setRawView: setRawView }),
    []
  )

  const { getUiPlugin } = useApplication()
  const TabsPlugin = getUiPlugin(
    '@development-framework/dm-core-plugins/view_selector/tabs'
  )
  return (
    <div className='flex-layout-container flex-row h-full'>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Progress.Circular />
        </div>
      ) : (
        <Sidebar>
          <TreeView
            nodes={treeNodes}
            onSelect={(node: TreeNode) => {
              if (node.type === EBlueprint.PACKAGE) return
              setAsRawView(false)
              setSelectedType(node.type)
              setSelectedEntity(node.nodeId)
              setNodeDimensions(Array.isArray(node.entity) ? '*' : undefined)
            }}
            NodeWrapper={nodeWrapper}
          />
        </Sidebar>
      )}
      {selectedType && selectedEntity && (
        <div className='flex-layout-container scroll'>
          {asRawView ? (
            <TabsPlugin
              type={selectedType}
              idReference={selectedEntity}
              config={default_raw_view_ui_recipe_config}
            />
          ) : (
            <EntityView
              type={selectedType}
              idReference={selectedEntity}
              dimensions={nodeDimensions}
            />
          )}
        </div>
      )}
    </div>
  )
}
