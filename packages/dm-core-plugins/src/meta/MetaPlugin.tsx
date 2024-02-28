import {
  EntityView,
  IUIPlugin,
  Loading,
  TGenericObject,
  TMeta,
  useDocument,
} from '@development-framework/dm-core'
import { Table } from '@equinor/eds-core-react'
import { DateTime } from 'luxon'

export const MetaPlugin = (props: IUIPlugin) => {
  const { document, isLoading, error } = useDocument<TGenericObject>(
    props.idReference,
    1
  )

  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  if (!document) return

  const meta: TMeta = document._meta_

  return (
    <>
      <Table className={'w-full'}>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Created by</Table.Cell>
            <Table.Cell>Created time</Table.Cell>
            <Table.Cell>Last modified by</Table.Cell>
            <Table.Cell>Last modified time</Table.Cell>
            <Table.Cell>Note</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{meta?.createdBy ?? '-'}</Table.Cell>
            <Table.Cell>
              {meta?.createdTimestamp
                ? DateTime.fromISO(meta.createdTimestamp).toLocaleString(
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23',
                    },
                    { locale: 'nb' }
                  )
                : '-'}
            </Table.Cell>
            <Table.Cell>{meta?.lastModifiedBy ?? '-'}</Table.Cell>
            <Table.Cell>
              {meta?.lastModifiedTimestamp
                ? DateTime.fromISO(meta.lastModifiedTimestamp).toLocaleString(
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23',
                    },
                    { locale: 'nb' }
                  )
                : '-'}
            </Table.Cell>
            <Table.Cell>{meta?.versionNote}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      {/*This empty div wrapper is kind of a hack to avoid EntityView take the same height as the entire plugin*/}
      <div>
        {document.type ===
        'dmss://system/Plugins/dm-core-plugins/common/Meta' ? (
          <EntityView
            {...props}
            type={document.content.type}
            idReference={`${props.idReference}.content`}
          />
        ) : (
          <EntityView
            {...props}
            type={document.type}
            idReference={props.idReference}
          />
        )}
      </div>
    </>
  )
}
