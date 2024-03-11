import {
  IUIPlugin,
  TGenericObject,
  TTableConfig,
  Table,
  useList,
} from '@development-framework/dm-core'
import * as utils from './utils'

export const TablePlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const config: TTableConfig = utils.mergeConfigs(props.config)

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

  return (
    <div className='dm-plugin-padding w-full'>
      <Table
        addItem={addItem}
        config={config}
        dirtyState={dirtyState}
        idReference={idReference}
        items={items}
        isLoading={isLoading}
        onOpen={props.onOpen}
        reloadData={reloadData}
        removeItem={removeItem}
        saveTable={save}
        setDirtyState={setDirtyState}
        setItems={setItems}
        updateItem={updateItem}
        type={props.type}
      />
    </div>
  )
}
