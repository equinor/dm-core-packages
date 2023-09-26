import { IUIPlugin, ViewCreator } from '@development-framework/dm-core'
import React, { useEffect, useState } from 'react'
import { intersection } from 'lodash'
import { Autocomplete, Banner, Icon } from '@equinor/eds-core-react'

type FilteredView = {
  type: string
  scope?: string
  label?: string
  eds_icon?: string
  roles: string[]
  viewId?: string
}
export const RoleFilterPlugin = (props: IUIPlugin): JSX.Element => {
  const { idReference, config } = props
  const [allowedViewConfigs, setAllowedViewConfigs] = useState<FilteredView[]>(
    []
  )
  const [openViewConfigs, setOpenViewConfigs] = useState<FilteredView[]>([])
  const [selectedRole, setSelectedRole] = useState<string>()
  const [allowedRoles, setAllowedRoles] = useState<string[]>([])

  // TODO: Implement real roles when User login is in place
  const User = {
    roles: ['admin', 'operator'],
  }

  useEffect(() => {
    let roles: string[] = []
    config.viewConfigs.forEach((viewConfig: FilteredView) => {
      roles = roles.concat(viewConfig.roles)
      viewConfig.viewId = crypto.randomUUID()
    })
    setAllowedRoles(roles)
    if (User.roles.length == 1) setSelectedRole(User.roles[0])
  }, [])

  useEffect(() => {
    if (!selectedRole) return

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
      {intersection(User.roles, allowedRoles).length ? (
        <>
          {intersection(User.roles, allowedRoles).length > 1 && (
            <Autocomplete
              options={intersection(User.roles, allowedRoles)}
              label={'Select a role'}
              onInputChange={setSelectedRole}
            />
          )}
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
          <Banner.Icon variant="warning">
            <Icon name="thumbs_down" />
          </Banner.Icon>
          <Banner.Message>
            {`No views found, since you currently have roles [${User.roles}]. Please switch to one of these roles: [${allowedRoles}]`}
          </Banner.Message>
        </Banner>
      )}
    </>
  )
}
