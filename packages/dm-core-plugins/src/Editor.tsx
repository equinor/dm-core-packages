import React, { useContext } from 'react'
import {
  ELayoutComponents,
  ILayout,
  useLayout,
} from './explorer/context/dashboard/useLayout'
import { ModalProvider } from './explorer/context/modal/ModalContext'
import { GoldenLayoutComponent } from './explorer/components/golden-layout/GoldenLayoutComponent'
import GoldenLayoutPanel from './explorer/components/golden-layout/GoldenLayoutPanel'
import styled from 'styled-components'
import {
  FSTreeContext,
  TreeNode,
  TreeView,
  UIRecipesSelector,
} from '@development-framework/dm-core'
import { NodeRightClickMenu } from './explorer/components/context-menu/ContextMenu'

import { Progress } from '@equinor/eds-core-react'

export const TreeWrapper = styled.div`
  width: 25%;
  min-width: 15vw;
  padding-left: 15px;
  padding-top: 15px;
  height: 100vh;
  border-right: black solid 1px;
  border-radius: 2px;
`

function wrapComponent(Component: any) {
  class Wrapped extends React.Component {
    render() {
      return (
        <GoldenLayoutPanel {...this.props}>
          <Component />
        </GoldenLayoutPanel>
      )
    }
  }

  return Wrapped
}

const LAYOUT_CONFIG = {
  dimensions: {
    headerHeight: 46,
  },
  content: [
    {
      type: 'stack',
      isClosable: false,
    },
  ],
}

export default () => {
  const { treeNodes, loading } = useContext(FSTreeContext)
  const layout: ILayout = useLayout()

  console.log('treenodes in tabs99', treeNodes)

  const open = (node: TreeNode) => {
    if (Array.isArray(node.entity)) {
      return
    }
    layout.operations.add(
      node.nodeId,
      node?.name || 'None',
      ELayoutComponents.blueprint,
      {
        idReference: node.nodeId,
        type: node.entity.type,
      }
    )
    layout.operations.focus(node.nodeId)
  }

  return (
    <ModalProvider>
      <div style={{ display: 'flex' }}>
        <TreeWrapper>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Progress.Circular />
            </div>
          ) : (
            <TreeView
              nodes={treeNodes}
              onSelect={(node: TreeNode) => open(node)}
              NodeWrapper={NodeRightClickMenu}
            />
          )}
        </TreeWrapper>
        <GoldenLayoutComponent
          htmlAttrs={{ style: { height: '100vh', width: '100%' } }}
          config={LAYOUT_CONFIG}
          registerComponents={(myLayout: any) => {
            myLayout.registerComponent(
              ELayoutComponents.blueprint,
              wrapComponent(UIRecipesSelector)
            )
            layout.operations.registerLayout({
              myLayout,
            })
          }}
        />
      </div>
    </ModalProvider>
  )
}
