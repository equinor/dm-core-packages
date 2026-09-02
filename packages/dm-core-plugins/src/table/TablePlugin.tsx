import {
  type IUIPlugin,
  type TGenericObject,
  useList,
  usePluginSaveRegistration,
  useSaveCoordinatorStore,
} from '@development-framework/dm-core'
import { Table, type TTableConfig } from './Table/Table'
import * as utils from './utils'

export const TablePlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const config: TTableConfig = utils.mergeConfigs(props.config)
  const coordinatorStore = useSaveCoordinatorStore()
  const entryId = `table:${idReference}`

  const {
    items,
    setItems,
    updateItem,
    isLoading,
    error,
    dirtyState,
    setDirtyState,
    addItem,
    removeItem,
    save,
    reloadData,
  } = useList<TGenericObject>(idReference, true)

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const { hasAnchorAbove, isCoordinated, notifyChanged } =
    usePluginSaveRegistration({
      id: entryId,
      idReference,
      isDirty: dirtyState,
      save: () =>
        save(items).then(() =>
          coordinatorStore?.notifyChanged(idReference, entryId)
        ),
      refetch: () => reloadData({}),
    })

  const deferSave = isCoordinated && hasAnchorAbove

  return (
    <div className='dm-plugin-padding'>
      <Table
        addItem={async (saveOnAdd, insertAtIndex, template) => {
          await addItem(saveOnAdd, insertAtIndex, template)
          notifyChanged()
        }}
        config={config}
        dirtyState={dirtyState}
        idReference={idReference}
        items={items}
        isLoading={isLoading}
        onOpen={props.onOpen}
        reloadData={reloadData}
        removeItem={async (item, saveOnRemove) => {
          await removeItem(item, !deferSave && saveOnRemove)
          if (!deferSave) notifyChanged()
        }}
        saveTable={(itemsToSave) =>
          save(itemsToSave).then(() => notifyChanged())
        }
        setDirtyState={setDirtyState}
        setItems={setItems}
        updateItem={async (item, newDocument, saveOnUpdate) => {
          await updateItem(item, newDocument, !deferSave && saveOnUpdate)

          if (deferSave) coordinatorStore?.update(entryId, { isDirty: true })
          if (!deferSave) notifyChanged()
        }}
        hideSaveControls={deferSave}
        type={props.type}
      />
    </div>
  )
}
