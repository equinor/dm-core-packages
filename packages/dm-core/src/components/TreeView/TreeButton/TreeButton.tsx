import { Button, Icon, Progress, Tooltip } from '@equinor/eds-core-react'
import { chevron_right } from '@equinor/eds-icons'
import styled from 'styled-components'
import { EBlueprint } from '../../../Enums'
import { TreeNode } from '../../../domain/Tree'
import { TypeIcon } from '../TypeIcon/TypeIcon'

const StyledButton = styled(Button)`
  padding: 0 8px 0 0;
  text-align: left;
  &:hover {
    background-color: rgba(222, 237, 238, 1);
  }
`

export const TreeButton = (props: {
  node: TreeNode
  expanded: boolean
  loading: boolean
  onClick: () => void
}) => {
  const { node, expanded, loading, onClick } = props

  let isExpandable = false
  if (node.type === 'dataSource') isExpandable = true
  if (
    node.entity instanceof Object &&
    !['dataSource', EBlueprint.FILE].includes(node.type)
  ) {
    isExpandable = Object.values(node?.entity).some(
      (value: any) => value instanceof Array || value instanceof Object
    )
  }

  return (
    <Tooltip
      enterDelay={600}
      title={node?.message || node?.type || ''}
      placement='right'
    >
      <StyledButton
        key={node.nodeId}
        data-testid={`tree-button_${node.name || node.nodeId}`}
        variant='ghost'
        color='secondary'
        onClick={(e: MouseEvent) => {
          if (node.type !== 'error') onClick()
          e.stopPropagation() // Stop clicking on the <TreeButton> propagate to trigger any wrapper "onClicks"
        }}
      >
        {isExpandable ? (
          <Icon
            data={chevron_right}
            className='transition-all'
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
        ) : (
          <span style={{ width: '25px' }}></span>
        )}
        <TypeIcon node={node} expanded={expanded} />
        {node.name || node.nodeId}
        {loading && <Progress.Circular size={16} />}
      </StyledButton>
    </Tooltip>
  )
}
