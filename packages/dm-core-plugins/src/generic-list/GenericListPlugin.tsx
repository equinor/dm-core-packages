import React from 'react'
import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
  EntityView,
} from '@development-framework/dm-core'

import { Accordion } from '@equinor/eds-core-react'

type TGenericListConfig = {
  expanded: boolean
}
const defaultConfig = {
  expanded: false,
}

export const GenericListPlugin = (
  props: IUIPlugin & { config?: TGenericListConfig }
) => {
  const { idReference, config } = props
  const internalConfig = { ...defaultConfig, ...config }
  const [document, loading, _, error] = useDocument<TGenericObject[]>(
    idReference,
    2
  )
  if (loading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (!document) return <Loading />
  return (
    <Accordion>
      {document.map((item: any, index: number) => (
        <Accordion.Item key={index} isExpanded={internalConfig.expanded}>
          <Accordion.Header>
            <Accordion.HeaderTitle>
              {`${idReference}.${index}`}
            </Accordion.HeaderTitle>
          </Accordion.Header>
          <Accordion.Panel>
            <EntityView
              type={item.type}
              idReference={`${idReference}.${index}`}
            />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
