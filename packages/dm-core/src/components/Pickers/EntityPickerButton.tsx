import React, { useContext, useEffect, useState } from 'react'

import { Button, Progress } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TGenericObject, TLinkReference } from '../../types'
import { ApplicationContext } from '../../context/ApplicationContext'
import { Tree, TreeNode } from '../../domain/Tree'
import { Dialog } from '../Dialog'
import { TREE_DIALOG_HEIGHT, TREE_DIALOG_WIDTH } from '../../utils/variables'
import { TreeView } from '../TreeView'
import { truncatePathString } from '../../utils/truncatePathString'
import { EBlueprint } from '../../Enums'

/**
 * A component for selecting an Entity.
 *
 * Uses the Tree component to let user pick an entity from the tree. After an entity is selected, the prop
 * "onChange" is called. If returnLinkReference is false, the onChange is called with the selected entity as an object.
 * If returnLinkReference is true, onChange is called with a link reference to the selected entity.
 */
export const EntityPickerButton = (props: {
  onChange: (value: TGenericObject | TLinkReference) => void
  returnLinkReference?: boolean
  typeFilter?: string
  text?: string
  variant?: 'contained' | 'outlined' | 'ghost' | 'ghost_icon'
  scope?: string // Path to a folder to limit the view within
}) => {
  const { onChange, typeFilter, text, variant, scope } = props
  const { returnLinkReference = false } = props
  const appConfig = useContext(ApplicationContext)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  const tree: Tree = new Tree((t: Tree) => setTreeNodes([...t]))

  useEffect(() => {
    setLoading(true)
    if (scope) {
      tree.initFromFolder(scope).finally(() => setLoading(false))
    } else {
      tree
        .initFromDataSources(appConfig.visibleDataSources)
        .finally(() => setLoading(false))
    }
  }, [scope])

  return (
    <div style={{ display: 'flex', flexDirection: 'row', margin: '0 10px' }}>
      <Button
        variant={variant || 'contained'}
        onClick={() => setShowModal(true)}
      >
        {text || 'Select'}
      </Button>
      <Dialog
        isOpen={showModal}
        closeScrim={() => setShowModal(false)}
        header={`Select an Entity ${typeFilter ? `of type ${typeFilter}` : ''}`}
        width={TREE_DIALOG_WIDTH}
        height={TREE_DIALOG_HEIGHT}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Progress.Circular />
          </div>
        ) : (
          <TreeView
            nodes={treeNodes}
            onSelect={(node: TreeNode) => {
              if (typeFilter && node.type !== typeFilter) {
                NotificationManager.warning(
                  `Type must be '${truncatePathString(typeFilter, 43)}'`
                )
                return
              }
              setShowModal(false)
              node
                .fetch()
                .then((doc: any) => {
                  setShowModal(false)
                  onChange(
                    returnLinkReference
                      ? {
                          type: EBlueprint.REFERENCE,
                          referenceType: 'link',
                          address: `dmss://${node.dataSource}/$${doc._id}`,
                        }
                      : doc
                  )
                })
                .catch((error: any) => {
                  console.error(error)
                  NotificationManager.error('Failed to fetch')
                })
            }}
          />
        )}
      </Dialog>
    </div>
  )
}
