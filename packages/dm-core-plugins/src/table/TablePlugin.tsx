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

  // Registers this table with the nearest SaveCoordinator (no-op if there is none,
  // e.g. when the table is used standalone - existing behavior is unaffected).
  const { hasAnchorAbove, isCoordinated, notifyChanged } =
    usePluginSaveRegistration({
      id: entryId,
      idReference,
      isDirty: dirtyState,
      // Notify related plugins even when flushed via an ancestor's saveAll() - not
      // just when saved through this table's own (possibly hidden) Save button.
      save: () =>
        save(items).then(() =>
          coordinatorStore?.notifyChanged(idReference, entryId)
        ),
      // reloadData is a state setter; called with no args it wouldn't change state and no-op.
      refetch: () => reloadData({}),
    })

  // Defer to an ancestor's save anchor (e.g. a Form or Stack claiming responsibility)
  // instead of guessing "am I nested" from React tree shape alone.
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
          // Mirrors the same fix in the List plugin: a nested row-level Form's save
          // flows into this table's local dirty state via this callback, but the
          // coordinator store only learns about it once this component re-renders
          // (a React scheduler round-trip, not guaranteed to land within the same
          // ancestor saveAll() pass). Push it synchronously too when deferred.
          if (deferSave) coordinatorStore?.update(entryId, { isDirty: true })
          if (!deferSave) notifyChanged()
        }}
        hideSaveControls={deferSave}
        type={props.type}
      />
    </div>
  )
}
