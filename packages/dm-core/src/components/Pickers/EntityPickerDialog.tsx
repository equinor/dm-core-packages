import {
  Button,
  Checkbox,
  EdsProvider,
  Progress,
} from '@equinor/eds-core-react'
import { type ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useApplication } from '../../ApplicationContext'
import { EBlueprint } from '../../Enums'
import { Tree, type TreeNode } from '../../domain/Tree'
import { Stack } from '../../layout'
import type { TValidEntity } from '../../types'
import { truncatePathString } from '../../utils/truncatePathString'
import { TREE_DIALOG_HEIGHT, TREE_DIALOG_WIDTH } from '../../utils/variables'
import { Dialog } from '../Dialog'
import { type TNodeWrapperProps, TreeView } from '../TreeView'

const Wrapper = styled.div<{ cursor?: string }>`
    display: flex;
    border-radius: 5px;
    justify-content: space-between;
    align-items: center;
    cursor: ${(props) => props.cursor ?? ''};
    border-bottom: 1px solid transparent;

    &:hover {
        background-color: rgba(229, 231, 235, 0.43);
    }
`
const CheckSelectNode = (
  props: TNodeWrapperProps & {
    onSelect: (node: TreeNode, selected: boolean) => void
    typeFilter?: string
    selectedNodeIds: string[]
  }
) => {
  const { node, children, onSelect, typeFilter, selectedNodeIds } = props
  const nodeIsSelected = selectedNodeIds.includes(node.nodeId)

  if (node.isArray()) return <>{children}</>
  return (
    <Wrapper cursor='pointer' onClick={() => onSelect(node, !nodeIsSelected)}>
      {children}
      {node.type === typeFilter && (
        <EdsProvider density={'compact'}>
          <Checkbox
            checked={nodeIsSelected}
            data-testid='select-multiple-entity-checkbox'
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onSelect(node, event.target.checked)
            }
          />
        </EdsProvider>
      )}
    </Wrapper>
  )
}

const ButtonSelectNode = (
  props: TNodeWrapperProps & {
    onSelect: (node: TreeNode) => void
    typeFilter?: string
  }
) => {
  const { node, children, onSelect, typeFilter } = props
  const [hover, setHover] = useState<boolean>(false)
  return (
    <Wrapper
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
    >
      {children}
      {hover && (
        <EdsProvider density={'compact'}>
          <Button
            variant='outlined'
            data-testid='select-single-entity-button'
            onClick={() => onSelect(node)}
          >
            Select
          </Button>
        </EdsProvider>
      )}
    </Wrapper>
  )
}

export type TEntityPickerReturn = {
  address: string
  entity: TValidEntity
  path: string
}

type TCommonProps = {
  showModal: boolean
  setShowModal: (x: boolean) => void
  typeFilter?: string
  scope?: string
  title?: string
  hideInvalidTypes?: boolean
}

type TEntityPickerDialogMulti = TCommonProps & { multiple: true } & {
  onChange: (v: TEntityPickerReturn[]) => void
}
type TEntityPickerDialog = TCommonProps & { multiple?: false | undefined } & {
  onChange: (v: TEntityPickerReturn) => void
}

/**
 * A component for selecting an Entity or an attribute of an entity.
 *
 * Uses the Tree component to let user pick an entity from the tree. After an entity is selected, the prop
 * "onChange" is called. If returnLinkReference is false, the onChange is called with the selected entity as an object.
 * If returnLinkReference is true, onChange is called with a link reference to the selected entity.
 *
 *
 * @param onChange: Calls callback-function with selected entity/entities. Value is a list if props 'multiple' is set
 * @param typeFilter: optional filter that can be added. If this is included, it is only possible to select an entity with the type specified by typeFilter.
 * @param variant: optional attribute to override the variant / styling used for the button
 * @param scope: optional attribute to define scope for tree view. The scope must be on the format: <DataSource>/<rootPackage>/<pathToFolder>
 * @param multiple: optional attribute to allow selection of multiple entities. Effects return type
 */
export const EntityPickerDialog = (
  props: TEntityPickerDialog | TEntityPickerDialogMulti
) => {
  const {
    onChange,
    showModal,
    title,
    setShowModal,
    typeFilter,
    scope,
    multiple = false,
    hideInvalidTypes = false,
  } = props
  const { dmssAPI, visibleDataSources } = useApplication()
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  const tree: Tree = new Tree(dmssAPI, (t: Tree) => setTreeNodes([...t]))
  const [selectedNodes, setSelectedNodes] = useState<TEntityPickerReturn[]>([])

  useEffect(() => {
    setLoading(true)
    if (scope) {
      2
      tree.initFromPath(scope).finally(() => setLoading(false))
    } else {
      tree
        .initFromDataSources(visibleDataSources)
        .finally(() => setLoading(false))
    }
  }, [scope])

  const handleSelect = (node: TreeNode, selected: boolean) => {
    if (typeFilter && (node.type !== typeFilter || node.isArray())) return
    if (selected) {
      // It has already been added
      if (selectedNodes.find((v) => node.nodeId === v.address)) return

      // append to selected
      node
        .fetch()
        .then((doc: any) => {
          setSelectedNodes([
            ...(selectedNodes as []),
            { address: node.nodeId, entity: doc, path: node.getPath() },
          ])
          if (!multiple) {
            // @ts-ignore  We know it should be singular
            onChange({
              address: node.nodeId,
              entity: doc,
              path: node.getPath(),
            })
            setShowModal(false)
            setSelectedNodes([])
          }
        })
        .catch((error: any) => {
          console.error(error)
          toast.error('Failed to fetch')
        })

      return
    }
    // filter out from selected
    setSelectedNodes(
      selectedNodes.filter(
        (v: TEntityPickerReturn) => v.address !== node.nodeId
      )
    )
  }

  return (
    <Dialog
      isDismissable
      open={showModal}
      onClose={() => {
        setSelectedNodes([])
        setShowModal(false)
      }}
      width={TREE_DIALOG_WIDTH}
      height={TREE_DIALOG_HEIGHT}
    >
      <Dialog.Header>
        <Dialog.Title>
          {title ||
            `Select an Entity ${
              typeFilter ? `of type '${truncatePathString(typeFilter)}'` : ''
            }`}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent style={{ overflow: 'hidden' }}>
        <Stack
          fullHeight
          padding={[0, 0, 1, 0]}
          style={{ borderBottom: '1px solid #e0dcdc' }}
        >
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Progress.Circular />
            </div>
          ) : (
            <Stack fullHeight scrollY padding={[0, 1, 0, 0]}>
              <TreeView
                // If configured to hide "invalidTypes", only show the "typeFilter", along with data sources and packages to allow for browsing
                includeTypes={
                  hideInvalidTypes
                    ? [EBlueprint.PACKAGE, 'dataSource', typeFilter ?? '']
                    : undefined
                }
                nodes={treeNodes}
                // If 'multiple', add a checkbox to handle selection, else a select button
                NodeWrapper={(props: TNodeWrapperProps) => {
                  if (props.node.type === 'dataSource')
                    return <>{props.children}</>

                  if (multiple)
                    return CheckSelectNode({
                      ...props,
                      typeFilter,
                      selectedNodeIds: selectedNodes.map((n) => n.address),
                      onSelect: (node: TreeNode, selected: boolean) =>
                        handleSelect(node, selected),
                    })

                  return ButtonSelectNode({
                    ...props,
                    typeFilter,
                    onSelect: (node: TreeNode) => handleSelect(node, true),
                  })
                }}
              />
            </Stack>
          )}
        </Stack>
      </Dialog.CustomContent>
      <Dialog.Actions style={{ justifyContent: 'right' }}>
        <Button
          variant='outlined'
          onClick={() => {
            setSelectedNodes([])
            setShowModal(false)
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!selectedNodes}
          onClick={() => {
            if (multiple) {
              // @ts-ignore
              onChange(selectedNodes)
            } else {
              if (!selectedNodes.length) {
              } else {
                // @ts-ignore
                onChange(selectedNodes[0])
              }
            }
            setShowModal(false)
          }}
        >
          Select
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
