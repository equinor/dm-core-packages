import React from 'react'
import { TreeNode } from '../../domain/Tree'
import { TreeListItem } from './TreeListItem/TreeListItem'
import { StyledList } from './styles'
import { TNodeWrapperProps } from './types'

export const TreeView = (props: {
  nodes: TreeNode[]
  onSelect?: (node: TreeNode) => void
  NodeWrapper?: React.FunctionComponent<TNodeWrapperProps>
  ignoredTypes?: string[] // Types to hide in the tree
  includeTypes?: string[] // Types to include in the tree (excludes the 'ignoredTypes' option)
}) => {
  const { nodes, onSelect, NodeWrapper, ignoredTypes, includeTypes } = props
  if (includeTypes && includeTypes.length) {
    includeTypes?.push('error') // Never hide error nodes
    return (
      <StyledList>
        {nodes
          .filter((node) => includeTypes.includes(node.type))
          .map((node) => (
            <TreeListItem
              key={node.nodeId}
              node={node}
              onSelect={onSelect}
              NodeWrapper={NodeWrapper}
              ignoredTypes={ignoredTypes}
              includeTypes={includeTypes}
            />
          ))}
      </StyledList>
    )
  }
  return (
    <StyledList>
      {nodes
        .filter((node) => !(ignoredTypes ?? []).includes(node.type))
        .map((node) => (
          <TreeListItem
            key={node.nodeId}
            node={node}
            onSelect={onSelect}
            NodeWrapper={NodeWrapper}
            ignoredTypes={ignoredTypes}
          />
        ))}
    </StyledList>
  )
}
