import {
  CopyLinkDialog,
  EntityView,
  type IUIPlugin,
} from '@development-framework/dm-core'
import { Button, Icon } from '@equinor/eds-core-react'
import { approve } from '@equinor/eds-icons'
import { useState } from 'react'
import { Stack } from '../common'

export const PublishPlugin = (
  props: IUIPlugin & {
    config: {
      destination: string
      linkDestination?: string
      description?: string
      wrapper?: string
      wrapperAttribute?: string
      mode?: 'copy' | 'link' | 'copy&link'
    }
  }
) => {
  const [showPublishDialog, setShowPublishDialog] = useState<boolean>(false)

  return (
    <div className='dm-plugin-padding'>
      <Stack alignItems='flex-end'>
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => setShowPublishDialog(true)}
        >
          Publish
          <Icon data={approve} />
        </Button>
        <CopyLinkDialog
          title={'Publish report'}
          description={props.config.description}
          buttonText={'Publish'}
          destination={props.config.destination}
          linkTarget={props.config.linkDestination}
          mode={props.config.mode || 'copy&link'}
          wrapper={props.config.wrapper}
          wrapperAttribute={props.config.wrapperAttribute || 'content'}
          hideProvidedFields={true}
          idReference={props.idReference}
          open={showPublishDialog}
          setOpen={setShowPublishDialog}
        />
      </Stack>
      <EntityView {...props} />
    </div>
  )
}
