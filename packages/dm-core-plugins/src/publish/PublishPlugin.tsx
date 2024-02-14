import {
  CopyLinkDialog,
  EntityView,
  IUIPlugin,
} from '@development-framework/dm-core'
import { Button, Icon } from '@equinor/eds-core-react'
import { approve } from '@equinor/eds-icons'
import { useState } from 'react'

export const PublishPlugin = (
  props: IUIPlugin & {
    config: {
      publishDestination: string
      publishWrapper?: string
      publishWrapperAttribute?: string
    }
  }
) => {
  const { idReference } = props
  const [showPublishDialog, setShowPublishDialog] = useState<boolean>(false)

  return (
    <div className={'flex flex-col'}>
      <div className={'justify-end flex'}>
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => setShowPublishDialog(true)}
        >
          Publish
          <Icon data={approve} />
        </Button>
        <CopyLinkDialog
          title={'Publish report?'}
          buttonText={'Publish'}
          destination={props.config.publishDestination}
          mode={'copy'}
          // Defaults to using a "Meta"-entity as a wrapper. Can be overridden with config
          wrapper={
            props.config.publishWrapper ||
            'dmss://system/Plugins/dm-core-plugins/common/Meta'
          }
          wrapperAttribute={props.config.publishWrapperAttribute || 'content'}
          hideProvidedFields={true}
          idReference={idReference}
          open={showPublishDialog}
          setOpen={setShowPublishDialog}
        />
      </div>
      <EntityView {...props} />
    </div>
  )
}
