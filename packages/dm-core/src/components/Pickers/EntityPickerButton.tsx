import React, { useContext, useEffect, useState } from 'react'

import { Button, Progress, Icon } from '@equinor/eds-core-react'
import { do_not_disturb } from '@equinor/eds-icons'
import { AxiosError } from 'axios'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TReference } from '../../types'
import { ApplicationContext } from '../../context/ApplicationContext'
import { Tree, TreeNode } from '../../domain/Tree'
import { Dialog } from '../Dialog'
import { TREE_DIALOG_HEIGHT, TREE_DIALOG_WIDTH } from '../../utils/variables'
import { TNodeWrapperProps, TreeView } from '../TreeView'
import { truncatePathString } from '../../utils/truncatePathString'
import { ErrorResponse } from '../../services'

const NodeWrapper = (props: TNodeWrapperProps & { typeFilter?: string }) => {
  const { node, children, typeFilter } = props
  return (
    <div style={{ display: 'flex' }}>
      {children}
      {typeFilter && node.type !== typeFilter && (
        <Icon
          data={do_not_disturb}
          title="save action"
          size={18}
          color={'salmon'}
        />
      )}
    </div>
  )
}
export const EntityPickerButton = (props: {
  onChange: (ref: TReference) => void
  typeFilter?: string
  text?: string
  variant?: 'contained' | 'outlined' | 'ghost' | 'ghost_icon'
  scope?: string // Path to a folder to limit the view within
}) => {
  const { onChange, typeFilter, text, variant, scope } = props
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
        header={'Select an Entity'}
        width={TREE_DIALOG_WIDTH}
        height={TREE_DIALOG_HEIGHT}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Progress.Circular />
          </div>
        ) : (
          <div style={{ paddingRight: '10px' }}>
            <TreeView
              nodes={treeNodes}
              NodeWrapper={(props: TNodeWrapperProps) =>
                NodeWrapper({ ...props, typeFilter })
              }
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
                    onChange(doc)
                  })
                  .catch((error: AxiosError<ErrorResponse>) => {
                    console.error(error.response?.data)
                    alert(error.response?.data.message)
                  })
              }}
            />
          </div>
        )}
      </Dialog>
    </div>
  )
}
