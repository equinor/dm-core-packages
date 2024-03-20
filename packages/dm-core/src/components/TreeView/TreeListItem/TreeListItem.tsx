import { useState } from 'react'
import styled from 'styled-components'
import { TreeNode } from '../../../domain/Tree'
import { TreeButton } from '../TreeButton/TreeButton'
import { TreeView } from '../TreeView'
import { TNodeWrapperProps } from '../types'

const StyledListItem = styled.li`
  list-style: none;
`

export const TreeListItem = (props: {
  node: TreeNode
  onSelect?: (node: TreeNode) => void
  NodeWrapper?: React.FunctionComponent<TNodeWrapperProps>
  ignoredTypes?: string[]
  includeTypes?: string[]
}) => {
  const { node, onSelect, NodeWrapper, ignoredTypes, includeTypes } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)

  const open = async () => {
    setLoading(true)
    await node.expand()
    setLoading(false)
    setExpanded(true)
  }
  const close = () => setExpanded(false)
  const setOpen = async (x: boolean) => (x ? await open() : close())
  const clickHandler = async () => {
    setOpen(!expanded)
    if (!['dataSource'].includes(node.type)) {
      if (onSelect) {
        onSelect(node)
      }
    }
  }

  return (
    <StyledListItem>
      {NodeWrapper ? (
        <NodeWrapper node={node} key={node.nodeId} setNodeOpen={setOpen}>
          <TreeButton
            node={node}
            expanded={expanded}
            loading={loading}
            onClick={clickHandler}
          />
        </NodeWrapper>
      ) : (
        <TreeButton
          node={node}
          expanded={expanded}
          loading={loading}
          onClick={clickHandler}
        />
      )}
      {expanded && (
        <TreeView
          nodes={Object.values(node.children)}
          onSelect={onSelect}
          NodeWrapper={NodeWrapper}
          ignoredTypes={ignoredTypes}
          includeTypes={includeTypes}
        />
      )}
    </StyledListItem>
  )
}
