import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { TreeNode } from '../domain/Tree'

import { Progress, Tooltip } from '@equinor/eds-core-react'
import React from 'react'
import {
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaExclamationTriangle,
  FaFileArchive,
  FaFileImage,
  FaFilePdf,
  FaFolder,
  FaFolderOpen,
  FaList,
  FaRegFileAlt,
} from 'react-icons/fa'
import { EBlueprint } from '../Enums'

type TStyledTreeNode = {
  level: number
}

const ExpandButton = styled.div`
  margin: 0 3px;
  width: 15px;
`

const StyledTreeNode = styled.div<TStyledTreeNode>`
  align-items: center;
  display: flex;
  padding-left: ${(props: TStyledTreeNode) => props.level * 20}px;
  cursor: pointer;
  width: -webkit-fill-available;

  &:hover {
    background-color: #acb7da;
  }
`

export type TNodeWrapperProps = {
  node: TreeNode
  removeNode?: () => void
  children: any
}

const GetIcon = (props: { node: TreeNode; expanded: boolean }) => {
  const { node, expanded } = props
  if (Array.isArray(node.entity)) {
    return <FaList title="list" />
  }
  if (Array.isArray(node?.parent?.entity)) {
    return <label>{'{}'}</label>
  }
  switch (node.type) {
    case EBlueprint.FILE: {
      const fileColor = '#2965FF'
      if (node.entity['filetype'] == 'application/pdf')
        return <FaFilePdf style={{ color: fileColor }} title="pdf" />
      if (node.entity['filetype'].startsWith('image'))
        return <FaFileImage style={{ color: fileColor }} title="image" />
      return <FaFileArchive style={{ color: fileColor }} title="zip" />
    }
    case 'dataSource':
      return <FaDatabase style={{ color: 'gray' }} title="data source" />
    case 'error':
      return (
        <FaExclamationTriangle
          style={{ color: 'orange' }}
          title="failed to load"
        />
      )
    case EBlueprint.BLUEPRINT:
      return <FaRegFileAlt style={{ color: '#2966FF' }} title="blueprint" />
    case EBlueprint.PACKAGE:
      if (expanded) {
        if (node.isRoot) {
          return (
            <FaFolderOpen style={{ color: '#8531A3' }} title="root package" />
          )
        } else {
          return <FaFolderOpen title="package" />
        }
      } else {
        if (node.isRoot) {
          return <FaFolder style={{ color: '#8531A3' }} title="root package" />
        } else {
          return <FaFolder title="package" />
        }
      }
    default:
      return <FaRegFileAlt title="file" />
  }
}

const TreeNodeComponent = (props: {
  node: TreeNode
  expanded: boolean
  onClick: (node: TreeNode, setLoading: (l: boolean) => void) => void
}) => {
  const { node, expanded, onClick } = props
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <StyledTreeNode
      key={node.nodeId}
      level={node.level}
      onClick={() => {
        if (node.type !== 'error') onClick(node, setLoading)
      }}
    >
      {[EBlueprint.PACKAGE, 'dataSource'].includes(node.type || '') ? (
        <ExpandButton>
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </ExpandButton>
      ) : (
        <div style={{ width: '18px' }} />
      )}
      <div>
        <GetIcon node={node} expanded={expanded} />
      </div>
      <Tooltip
        enterDelay={600}
        title={node?.message || node?.type || ''}
        placement="top-start"
      >
        <div style={{ paddingLeft: '5px' }}>{node.name || node.nodeId}</div>
      </Tooltip>
      {loading && (
        <Progress.Circular
          color={'primary'}
          size={16}
          style={{ marginLeft: '5px' }}
        />
      )}
    </StyledTreeNode>
  )
}

export const TreeView = (props: {
  nodes: TreeNode[]
  onSelect: (node: TreeNode) => void
  NodeWrapper?: React.FunctionComponent<TNodeWrapperProps>
  ignoredTypes?: string[] // Types to hide in the tree
}) => {
  const { nodes, onSelect, NodeWrapper, ignoredTypes } = props

  // Use a per TreeView state to keep track of expanded nodes.
  // This is so clicking in one tree will not affect other TreeViews
  const [expandedNodes, setExpandedNodes] = useState<{ [k: string]: boolean }>(
    {}
  )

  useEffect(() => {
    const expandedNodes: { [k: string]: boolean } = {}
    nodes.forEach((node: TreeNode) => {
      // Initialize expanded state where only top level nodes are expanded
      expandedNodes[node.nodeId] = node.level === 0
    })
    setExpandedNodes(expandedNodes)
  }, [])

  const _onClick = async (node: TreeNode, setLoading: (l: boolean) => void) => {
    const newExpandedNodes: { [k: string]: boolean } = {}
    if (!expandedNodes[node.nodeId]) {
      setLoading(true)
      await node.expand()
      setLoading(false)
      newExpandedNodes[node.nodeId] = true
    } else {
      // Set all children nodes as collapsed recursively
      // @ts-ignore
      for (const child of node) {
        newExpandedNodes[child.nodeId] = false
      }
      newExpandedNodes[node.nodeId] = false
    }
    setExpandedNodes({ ...expandedNodes, ...newExpandedNodes })
    if (![EBlueprint.PACKAGE, 'dataSource'].includes(node.type)) {
      onSelect(node)
    }
  }

  return (
    <div style={{ height: 'auto', overflow: 'auto' }}>
      {nodes.map((node: TreeNode) => {
        // If it has a parent, and the parent is not expanded, hide node
        if (ignoredTypes?.length && ignoredTypes.includes(node.type))
          return null
        if (node?.parent && !expandedNodes[node.parent?.nodeId]) return null
        if (NodeWrapper) {
          return (
            <NodeWrapper node={node} key={node.nodeId}>
              <TreeNodeComponent
                node={node}
                expanded={expandedNodes[node.nodeId]}
                onClick={(node: TreeNode, setLoading: (l: boolean) => void) =>
                  _onClick(node, setLoading)
                }
              />
            </NodeWrapper>
          )
        } else {
          return (
            <TreeNodeComponent
              key={node.nodeId}
              node={node}
              expanded={expandedNodes[node.nodeId]}
              onClick={(node: TreeNode, setLoading: (l: boolean) => void) =>
                _onClick(node, setLoading)
              }
            />
          )
        }
      })}
    </div>
  )
}
