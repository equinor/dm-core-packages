import React, { useContext, useEffect, useState } from 'react'

import { Button, Progress } from '@equinor/eds-core-react'
import { toast } from 'react-toastify'
import { EBlueprint } from '../../Enums'
import { ApplicationContext } from '../../context/ApplicationContext'
import { Tree, TreeNode } from '../../domain/Tree'
import { TValidEntity } from '../../types'
import { truncatePathString } from '../../utils/truncatePathString'
import { TREE_DIALOG_WIDTH } from '../../utils/variables'
import { Dialog } from '../Dialog'
import { TreeView } from '../TreeView'

/**
 * A component for selecting an Entity or an attribute of an entity.
 *
 * Uses the Tree component to let user pick an entity from the tree. After an entity is selected, the prop
 * "onChange" is called. If returnLinkReference is false, the onChange is called with the selected entity as an object.
 * If returnLinkReference is true, onChange is called with a link reference to the selected entity.
 *
 *
 * @param onChange: function to call when entity is selected.
 * @param returnLinkReference: if this is set to true, onChange is called with a link reference to the selected entity (or a complex attribute inside the entity) instead of the entity object.
 * @param typeFilter: optional filter that can be added. If this is included, it is only possible to select an entity with the type specified by typeFilter.
 * @param alternativeButtonText: optional attribute to override the Button text
 * @param variant: optional attribute to override the variant / styling used for the button
 * @param scope: optional attribute to define scope for tree view. The scope must be on the format: <DataSource>/<rootPackage>/<pathToFolder>
 */
export const EntityPickerDialog = (props: {
  onChange: (address: string, entity: TValidEntity) => void
  showModal: boolean
  setShowModal: (x: boolean) => void
  typeFilter?: string
  scope?: string
}) => {
  const { onChange, showModal, setShowModal, typeFilter, scope } = props
  const appConfig = useContext(ApplicationContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  const tree: Tree = new Tree((t: Tree) => setTreeNodes([...t]))
  const [selectedTreeNode, setSelectedTreeNode] = useState<
    TreeNode | undefined
  >()

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

  const handleSelectEntityInTree = () => {
    if (!selectedTreeNode) {
      return
    }
    selectedTreeNode
      .fetch()
      .then((doc: any) => {
        setShowModal(false)
        onChange(selectedTreeNode.nodeId, doc)
      })
      .catch((error: any) => {
        console.error(error)
        toast.error('Failed to fetch')
      })
      .finally(() => {
        setSelectedTreeNode(undefined)
        setShowModal(false)
      })
  }

  return (
    <Dialog
      isDismissable
      open={showModal}
      onClose={() => {
        setSelectedTreeNode(undefined)
        setShowModal(false)
      }}
      width={TREE_DIALOG_WIDTH}
    >
      <Dialog.Header>
        <Dialog.Title>
          {`Select an Entity ${typeFilter ? `of type ${typeFilter}` : ''}`}
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Progress.Circular />
          </div>
        ) : (
          <div>
            <div style={{ height: '40vh', overflow: 'auto' }}>
              <TreeView
                ignoredTypes={[EBlueprint.BLUEPRINT]}
                nodes={treeNodes}
                onSelect={(node: TreeNode) => {
                  if (typeFilter && node.type !== typeFilter) {
                    toast.warning(
                      `Type must be '${truncatePathString(typeFilter, 43)}'`,
                    )
                    setSelectedTreeNode(undefined)
                    return
                  }
                  setSelectedTreeNode(node)
                }}
              />
            </div>
            <p>
              {selectedTreeNode
                ? `Selected: ${
                    selectedTreeNode?.name ?? selectedTreeNode.nodeId
                  }`
                : 'No entity selected'}
            </p>
          </div>
        )}
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button disabled={!selectedTreeNode} onClick={handleSelectEntityInTree}>
          Select
        </Button>
        <Button
          variant='ghost'
          onClick={() => {
            setSelectedTreeNode(undefined)
            setShowModal(false)
          }}
        >
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
