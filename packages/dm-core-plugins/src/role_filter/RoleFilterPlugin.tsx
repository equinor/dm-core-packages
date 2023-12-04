import {
  IUIPlugin,
  RoleContext,
  ViewCreator,
} from '@development-framework/dm-core'
import React, { useContext, useEffect, useState } from 'react'
import { Banner, Icon } from '@equinor/eds-core-react'
import { edit_text, save, thumbs_down } from '@equinor/eds-icons'

Icon.add({ thumbs_down, save, edit_text })

type FilteredView = {
  type: string
  scope?: string
  label?: string
  eds_icon?: string
  roles: string[]
  viewId?: string
}
export const RoleFilterPlugin = (props: IUIPlugin): React.ReactElement => {
  const { idReference, config } = props
  const [allowedViewConfigs, setAllowedViewConfigs] = useState<FilteredView[]>(
    []
  )
  const [openViewConfigs, setOpenViewConfigs] = useState<FilteredView[]>([])
  const [allowedRoles, setAllowedRoles] = useState<string[]>([])
  const { selectedRole } = useContext(RoleContext)

  useEffect(() => {
    let roles: string[] = []
    config.viewConfigs.forEach((viewConfig: FilteredView) => {
      roles = roles.concat(viewConfig.roles)
      viewConfig.viewId = crypto.randomUUID()
    })
    setAllowedRoles(roles)
  }, [])

  useEffect(() => {
    const allowedViewConfigs: FilteredView[] = []
    const openViewConfigs: FilteredView[] = []
    config.viewConfigs.forEach((viewConfig: FilteredView) => {
      if (!viewConfig.roles) {
        // if viewConfig does not have roles specified, we interpret it as "everyone"
        openViewConfigs.push(viewConfig)
      } else if (viewConfig.roles.includes(selectedRole)) {
        allowedViewConfigs.push(viewConfig)
      }
    })
    setAllowedViewConfigs(allowedViewConfigs)
    setOpenViewConfigs(openViewConfigs)
  }, [selectedRole])

  return (
    <>
      {allowedRoles.includes(selectedRole) ? (
        <>
          {allowedViewConfigs?.map((viewConfig) => (
            <ViewCreator
              key={viewConfig.viewId}
              idReference={idReference}
              viewConfig={viewConfig}
            />
          ))}
        </>
      ) : // The user does not have any role matching any view, show any views without roles
      openViewConfigs.length ? (
        openViewConfigs.map((viewConfig) => (
          <ViewCreator
            key={viewConfig.viewId}
            idReference={idReference}
            viewConfig={viewConfig}
          />
        ))
      ) : (
        // The user does not have any role matching any view, so there is nothing to show
        <Banner>
          <Banner.Icon variant='warning'>
            <Icon data={thumbs_down} />
          </Banner.Icon>
          <Banner.Message>
            {`No views found, since you currently have role [${selectedRole}]. Please switch to one of these roles: [${allowedRoles}]`}
          </Banner.Message>
        </Banner>
      )}
    </>
  )
}
