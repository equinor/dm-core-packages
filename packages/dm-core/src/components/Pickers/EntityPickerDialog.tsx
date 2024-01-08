import React, { ChangeEvent, useContext, useEffect, useState } from 'react'

import {
  Button,
  Checkbox,
  EdsProvider,
  Progress,
} from '@equinor/eds-core-react'
import { toast } from 'react-toastify'
import { ApplicationContext } from '../../context/ApplicationContext'
import { Tree, TreeNode } from '../../domain/Tree'
import { TValidEntity } from '../../types'
import { TREE_DIALOG_HEIGHT, TREE_DIALOG_WIDTH } from '../../utils/variables'
import { Dialog } from '../Dialog'
import { TNodeWrapperProps, TreeView } from '../TreeView'
import styled from 'styled-components'
import { truncatePathString } from '../../utils/truncatePathString'
import { EBlueprint } from '../../Enums'

const Wrapper = styled.div<{ selected: boolean }>`
  display: flex;
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: rgba(222, 237, 238, 1);
  }
`
const CheckSelectNode = (
  props: TNodeWrapperProps & {
    onSelect: (node: TreeNode, selected: boolean) => void
    typeFilter: string
    selectedNodeIds: string[]
    multiple: boolean
  }
) => {
  const { node, children, onSelect, typeFilter, selectedNodeIds, multiple } =
    props
  const nodeIsSelected = selectedNodeIds.includes(node.nodeId)
  return (
    <Wrapper selected={nodeIsSelected}>
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

export type TEntityPickerReturn = {
  address: string
  entity: TValidEntity
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
    setShowModal,
    typeFilter,
    scope,
    multiple = false,
    hideInvalidTypes = false,
  } = props
  const appConfig = useContext(ApplicationContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  const tree: Tree = new Tree((t: Tree) => setTreeNodes([...t]))
  const [selectedNodes, setSelectedNodes] = useState<TEntityPickerReturn[]>([])

  useEffect(() => {
    setLoading(true)
    if (scope) {
      tree.initFromPath(scope).finally(() => setLoading(false))
    } else {
      tree
        .initFromDataSources(appConfig.visibleDataSources)
        .finally(() => setLoading(false))
    }
  }, [scope])

  const handleSelect = (node: TreeNode, selected: boolean) => {
    if (node.type !== typeFilter || node.isArray()) return
    if (selected) {
      // It has already been added
      if (selectedNodes.find((v) => node.nodeId === v.address)) return

      // append to selected
      node
        .fetch()
        .then((doc: any) => {
          setSelectedNodes([
            ...(selectedNodes as []),
            { address: node.nodeId, entity: doc },
          ])
          if (!multiple) {
            // @ts-ignore  We know it should be singular
            onChange({ address: node.nodeId, entity: doc })
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
          {`Select an Entity ${
            typeFilter ? `of type '${truncatePathString(typeFilter)}'` : ''
          }`}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent style={{ overflow: 'hidden' }}>
        <div className='flex flex-col h-full'>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Progress.Circular />
            </div>
          ) : (
            <div className='overflow-auto h-full'>
              <TreeView
                // If configured to hide "invalidTypes", only show the "typeFilter", along with data sources and packages to allow for browsing
                includeTypes={
                  hideInvalidTypes
                    ? [EBlueprint.PACKAGE, 'dataSource', typeFilter ?? '']
                    : undefined
                }
                nodes={treeNodes}
                // If not 'multiple', clicking a valid entity selects it, and closes the dialog
                onSelect={(node: TreeNode) => {
                  if (!multiple) handleSelect(node, true)
                }}
                // If 'multiple', add a checkbox to handle selection
                NodeWrapper={
                  multiple
                    ? (props: any) =>
                        CheckSelectNode({
                          ...props,
                          multiple,
                          typeFilter,
                          selectedNodeIds: selectedNodes.map((n) => n.address),
                          onSelect: (node: TreeNode, selected: boolean) =>
                            handleSelect(node, selected),
                        })
                    : undefined
                }
              />
            </div>
          )}
          <div className='bg-[#e0dcdc] h-px inline mt-5'></div>
        </div>
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
