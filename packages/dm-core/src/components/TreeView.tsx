import { useState } from 'react'
import styled from 'styled-components'
import { TreeNode } from '../domain/Tree'

import { Button, Icon, Progress, Tooltip } from '@equinor/eds-core-react'
import { chevron_down, chevron_right } from '@equinor/eds-icons'
import React from 'react'
import {
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

const StyledButton = styled(Button)`
  padding: 0 8px 0 0;
`

const StyledUl = styled.ul`
  padding: 0;
  & & {
    padding-left: 1rem;
  }
`

const StyledLi = styled.li`
  list-style: none;
`

export type TNodeWrapperProps = {
  node: TreeNode
  setNodeOpen: (x: boolean) => void
  children: any
}

const TypeIcon = (props: { node: TreeNode; expanded: boolean }) => {
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

const TreeButton = (props: {
  node: TreeNode
  expanded: boolean
  loading: boolean
  onClick: () => void
}) => {
  const { node, expanded, loading, onClick } = props

  return (
    <Tooltip
      enterDelay={600}
      title={node?.message || node?.type || ''}
      placement="right"
    >
      <StyledButton
        key={node.nodeId}
        variant="ghost"
        color="secondary"
        onClick={() => {
          if (node.type !== 'error') onClick()
        }}
      >
        <Icon data={expanded ? chevron_down : chevron_right} />
        <TypeIcon node={node} expanded={expanded} />
        {node.name || node.nodeId}
        {loading && <Progress.Circular size={16} />}
      </StyledButton>
    </Tooltip>
  )
}

const TreeListItem = (props: {
  node: TreeNode
  onSelect: (node: TreeNode) => void
  NodeWrapper?: React.FunctionComponent<TNodeWrapperProps>
  ignoredTypes?: string[]
}) => {
  const { node, onSelect, NodeWrapper, ignoredTypes } = props
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
    if (![EBlueprint.PACKAGE, 'dataSource'].includes(node.type)) {
      onSelect(node)
    }
  }

  return (
    <StyledLi>
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
        />
      )}
    </StyledLi>
  )
}

export const TreeView = (props: {
  nodes: TreeNode[]
  onSelect: (node: TreeNode) => void
  NodeWrapper?: React.FunctionComponent<TNodeWrapperProps>
  ignoredTypes?: string[] // Types to hide in the tree
}) => {
  const { nodes, onSelect, NodeWrapper, ignoredTypes } = props

  return (
    <StyledUl>
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
    </StyledUl>
  )
}
