import { type IUIPlugin, useApplication } from '@development-framework/dm-core'
import { Button, Icon, Switch, Typography } from '@equinor/eds-core-react'
import {
  add,
  delete_to_trash,
  edit,
  external_link,
  refresh,
  warning_outlined,
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
  /** Friendly display name; falls back to `name` (the slug) when unset. */
  label: string
  /** Whether the site is published (live) or still a draft. */
  published: boolean
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
 * Derive a deterministic hue (0–360) from a string so every card gets its
 * own colour without any runtime randomness that would shift on re-render.
 */
const hueFromString = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff
  return h % 360
}

type SiteCardProps = {
  site: TSiteHit
  viewUrl: string
  editUrl: string | null
  onDelete: () => void
  deleting: boolean
}

const SiteCard = ({
  site,
  viewUrl,
  editUrl,
  onDelete,
  deleting,
}: SiteCardProps) => {
  const initial = (site.label[0] ?? '?').toUpperCase()
  const [hovered, setHovered] = useState(false)
  // Two-step delete: first click arms the button, second click confirms.
  const [confirming, setConfirming] = useState(false)
  const h = hueFromString(site.id)

  const handleDeleteClick = () => {
    if (confirming) {
      onDelete()
    } else {
      setConfirming(true)
    }
  }

  // Cancel confirm state when the mouse leaves the card.
  const handleMouseLeave = () => {
    setHovered(false)
    setConfirming(false)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: 6,
        background: '#fff',
        border: `1px solid ${confirming ? '#ff6b6b' : '#e0e0e0'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition:
          'box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.14)'
          : '0 2px 6px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        opacity: deleting ? 0.5 : 1,
      }}
    >
      {/* Coloured banner with the site's initial letter */}
      <div
        style={{
          background: `linear-gradient(135deg, hsl(${h},55%,38%) 0%, hsl(${(h + 40) % 360},60%,52%) 100%)`,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.80)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-2px',
          }}
        >
          {initial}
        </span>
        {!site.published && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: '3px 10px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.40)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            Draft
          </span>
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flexGrow: 1,
        }}
      >
        <Typography
          variant='h6'
          style={{
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 16,
          }}
          title={site.label}
        >
          {site.label}
        </Typography>
        <Typography
          variant='caption'
          style={{ color: '#6f6f6f', marginBottom: 14 }}
        >
          {site.dataSource}
        </Typography>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <a href={viewUrl} style={{ textDecoration: 'none', flexGrow: 1 }}>
            <Button
              variant='contained'
              style={{ width: '100%' }}
              disabled={deleting}
            >
              <Icon data={external_link} size={16} />
              Open
            </Button>
          </a>
          {editUrl ? (
            <a href={editUrl} style={{ textDecoration: 'none' }}>
              <Button
                variant='ghost_icon'
                aria-label='Edit site'
                disabled={deleting}
              >
                <Icon data={edit} size={18} />
              </Button>
            </a>
          ) : null}
          <Button
            variant='ghost_icon'
            aria-label={confirming ? 'Confirm delete' : 'Delete site'}
            title={
              confirming ? 'Click again to confirm deletion' : 'Delete site'
            }
            disabled={deleting}
            onClick={handleDeleteClick}
            style={
              confirming
                ? { color: '#b30d2f', background: '#fff0f2' }
                : undefined
            }
          >
            <Icon data={delete_to_trash} size={18} />
          </Button>
        </div>
        {confirming ? (
          <Typography
            variant='caption'
            style={{ color: '#b30d2f', marginTop: 6, textAlign: 'right' }}
          >
            Click trash again to confirm
          </Typography>
        ) : null}
      </div>
    </div>
  )
}

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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  // Authors need to see their drafts to finish and publish them, so drafts are
  // shown by default; toggling this off previews the published-only view.
  const [showDrafts, setShowDrafts] = useState(true)

  const buildUrl = useCallback(
    (template: string | undefined, dataSource: string, id: string): string =>
      (template ?? DEFAULT_VIEW_URL)
        .replace('{dataSource}', dataSource)
        .replace('{id}', id),
    []
  )

  const viewUrl = useCallback(
    (dataSource: string, id: string) =>
      buildUrl(config?.viewUrlTemplate, dataSource, id),
    [buildUrl, config?.viewUrlTemplate]
  )

  const editUrl = useCallback(
    (dataSource: string, id: string): string | null =>
      config?.newSiteUrlTemplate
        ? buildUrl(config.newSiteUrlTemplate, dataSource, id)
        : null,
    [buildUrl, config?.newSiteUrlTemplate]
  )

  // Freshly created sites are empty, so they open in the editor (falling back to
  // the normal view URL when no dedicated create URL is configured).
  const createUrl = useCallback(
    (dataSource: string, id: string): string =>
      buildUrl(
        config?.newSiteUrlTemplate ?? config?.viewUrlTemplate,
        dataSource,
        id
      ),
    [buildUrl, config?.newSiteUrlTemplate, config?.viewUrlTemplate]
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
          { _id?: string; name?: string; title?: string; published?: boolean }
        >
        const hits: TSiteHit[] = Object.entries(data).map(([address, doc]) => {
          const id = doc._id ?? address.split('/').slice(1).join('/')
          const name = doc.name ?? id ?? 'Untitled site'
          return {
            address,
            dataSource: dataSourceOf(address),
            id,
            name,
            label:
              typeof doc.title === 'string' && doc.title.trim() !== ''
                ? doc.title
                : name,
            published: doc.published === true,
          }
        })
        hits.sort((a, b) => a.label.localeCompare(b.label))
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
      window.location.assign(createUrl(dataSource, id))
    } catch (error) {
      console.error('Failed to create site', error)
      setCreateError('Could not create a new site. Please try again.')
      setCreating(false)
    }
  }, [config?.newSiteName, dmssAPI, entityType, target, createUrl])

  const handleDelete = useCallback(
    async (site: TSiteHit) => {
      setDeletingId(site.id)
      try {
        // documentRemove takes a full DMSS address; root documents use the
        // `$id` syntax (the `$` is DMSS's root-id sigil, not a JS template).
        await dmssAPI.documentRemove({
          address: `dmss://${site.dataSource}/$${site.id}`,
        })
        setSites((current) => current.filter((s) => s.id !== site.id))
      } catch (error) {
        console.error('Failed to delete site', error)
      } finally {
        setDeletingId(null)
      }
    },
    [dmssAPI]
  )

  const draftCount = sites.filter((site) => !site.published).length
  const visibleSites = showDrafts
    ? sites
    : sites.filter((site) => site.published)

  return (
    <div className='dm-plugin-padding' style={{ width: '100%' }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Typography variant='h4'>{heading}</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {draftCount > 0 ? (
            <Switch
              label='Show drafts'
              checked={showDrafts}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setShowDrafts(event.target.checked)
              }
            />
          ) : null}
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

      {status === 'loading' ? (
        <Typography style={{ color: '#6f6f6f' }}>Loading websites…</Typography>
      ) : null}

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
        <div
          style={{ textAlign: 'center', padding: '48px 0', color: '#6f6f6f' }}
        >
          <Typography variant='h5' style={{ marginBottom: 8 }}>
            No websites yet
          </Typography>
          {allowCreate && target ? (
            <Typography>
              Click <strong>New site</strong> to create your first one.
            </Typography>
          ) : null}
        </div>
      ) : null}

      {status === 'ready' && sites.length > 0 && visibleSites.length === 0 ? (
        <Typography style={{ color: '#6f6f6f' }}>
          No published websites yet. Turn on "Show drafts" to see unpublished
          sites.
        </Typography>
      ) : null}

      {status === 'ready' && visibleSites.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {visibleSites.map((site) => (
            <SiteCard
              key={site.address}
              site={site}
              viewUrl={viewUrl(site.dataSource, site.id)}
              editUrl={editUrl(site.dataSource, site.id)}
              onDelete={() => handleDelete(site)}
              deleting={deletingId === site.id}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
