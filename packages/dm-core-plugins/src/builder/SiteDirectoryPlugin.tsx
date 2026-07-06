import { type IUIPlugin, useApplication } from '@development-framework/dm-core'
import { Button, Card, Icon, Typography } from '@equinor/eds-core-react'
import {
  add,
  external_link,
  refresh,
  warning_outlined,
  world,
} from '@equinor/eds-icons'
import { useCallback, useEffect, useState } from 'react'
import {
  createEmptySite,
  resolvePluginAliases,
  SITE_TYPE_ADDRESS,
  serializeSite,
} from './site'
import type { TSiteDirectoryConfig } from './siteDirectory.types'

type TSiteHit = {
  address: string
  dataSource: string
  id: string
  name: string
}

// The literal `$` before the `{id}` placeholder marks a DMSS root-document id;
// it is not a template-string interpolation.
// biome-ignore lint/suspicious/noTemplateCurlyInString: literal `${id}` placeholder
const DEFAULT_VIEW_URL = '/view?documentId=dmss://{dataSource}/${id}'

/** DMSS names allow only alphanumerics, underscore and dash. */
const toSlug = (value: string): string =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'New_site'

/** Strip a leading `dmss://` and any path, leaving the data source id. */
const dataSourceOf = (address: string): string =>
  address.replace(/^dmss:\/\//, '').split('/')[0]

/**
 * Site directory — a gallery of saved websites.
 *
 * Searches DMSS for every entity of the builder's Site type and lists them as
 * cards that open the (read-only) site viewer, so people can actually browse
 * what they build. Optionally creates a fresh site and jumps into the editor.
 *
 * It is intentionally routing-agnostic: cards are plain links built from
 * `config.viewUrlTemplate`, defaulting to the example app's `/view?documentId=`
 * convention, so it works in any host app without a hard router dependency.
 */
export const SiteDirectoryPlugin = (
  props: IUIPlugin & { config?: TSiteDirectoryConfig }
): React.ReactElement => {
  const { config } = props
  const { dmssAPI, visibleDataSources } = useApplication()

  const entityType = config?.entityType ?? SITE_TYPE_ADDRESS
  const dataSources =
    config?.dataSources && config.dataSources.length > 0
      ? config.dataSources
      : visibleDataSources
  const heading = config?.heading ?? 'Websites'
  const allowCreate = config?.allowCreate ?? true
  const target = config?.targetDataSource ?? dataSources[0]

  const [sites, setSites] = useState<TSiteHit[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const viewUrl = useCallback(
    (dataSource: string, id: string): string =>
      (config?.viewUrlTemplate ?? DEFAULT_VIEW_URL)
        .replace('{dataSource}', dataSource)
        .replace('{id}', id),
    [config?.viewUrlTemplate]
  )

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    dmssAPI
      .search({ dataSources, body: { type: entityType } })
      .then((response) => {
        if (cancelled) return
        const data = (response.data ?? {}) as Record<
          string,
          { _id?: string; name?: string }
        >
        const hits: TSiteHit[] = Object.entries(data).map(([address, doc]) => {
          const id = doc._id ?? address.split('/').slice(1).join('/')
          return {
            address,
            dataSource: dataSourceOf(address),
            id,
            name: doc.name ?? id ?? 'Untitled site',
          }
        })
        hits.sort((a, b) => a.name.localeCompare(b.name))
        setSites(hits)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Site directory search failed', error)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
    // dataSources is derived from config/context; join to a stable dep.
  }, [dmssAPI, entityType, dataSources.join(','), reloadKey])

  const handleCreate = useCallback(async () => {
    if (!target) return
    setCreating(true)
    setCreateError(null)
    try {
      const dataSource = dataSourceOf(target)
      // DMSS names allow only alphanumerics/underscore/dash; add a short suffix
      // so repeated "New site" clicks don't collide.
      const name = `${toSlug(config?.newSiteName ?? 'New_site')}_${Date.now().toString(36)}`
      // The context-free add-raw endpoint stores the document verbatim, so emit
      // fully-qualified addresses (not the `PLUGINS:` alias) and stamp the root
      // `type` with the listed entity type so the new site is found and rendered.
      const body = {
        ...resolvePluginAliases(serializeSite(createEmptySite())),
        type: entityType,
        name,
      }
      const response = await dmssAPI.documentAddSimple({
        dataSourceId: dataSource,
        body,
      })
      const id = typeof response.data === 'string' ? response.data : name
      window.location.assign(viewUrl(dataSource, id))
    } catch (error) {
      console.error('Failed to create site', error)
      setCreateError('Could not create a new site. Please try again.')
      setCreating(false)
    }
  }, [config?.newSiteName, dmssAPI, entityType, target, viewUrl])

  return (
    <div className='dm-plugin-padding' style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Typography variant='h4'>{heading}</Typography>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant='ghost_icon'
            aria-label='Refresh list'
            onClick={() => setReloadKey((key) => key + 1)}
          >
            <Icon data={refresh} size={18} />
          </Button>
          {allowCreate && target ? (
            <Button onClick={handleCreate} disabled={creating}>
              <Icon data={add} size={18} />
              {creating ? 'Creating…' : 'New site'}
            </Button>
          ) : null}
        </div>
      </div>

      {createError ? (
        <Typography color='danger' style={{ marginBottom: 12 }}>
          {createError}
        </Typography>
      ) : null}

      {status === 'loading' ? <Typography>Loading websites…</Typography> : null}

      {status === 'error' ? (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          role='alert'
        >
          <Icon data={warning_outlined} size={18} />
          <Typography>
            Could not load websites. Check your data source access and try
            refreshing.
          </Typography>
        </div>
      ) : null}

      {status === 'ready' && sites.length === 0 ? (
        <Typography>
          No websites yet.{' '}
          {allowCreate && target
            ? 'Use “New site” to create your first one.'
            : ''}
        </Typography>
      ) : null}

      {status === 'ready' && sites.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {sites.map((site) => (
            <Card key={site.address} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon data={world} size={24} />
                <Typography variant='h6' style={{ margin: 0 }}>
                  {site.name}
                </Typography>
              </div>
              <Typography
                variant='caption'
                style={{ display: 'block', margin: '4px 0 12px' }}
              >
                {site.dataSource}
              </Typography>
              <a
                href={viewUrl(site.dataSource, site.id)}
                style={{ textDecoration: 'none' }}
              >
                <Button variant='outlined'>
                  <Icon data={external_link} size={18} />
                  Open
                </Button>
              </a>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
