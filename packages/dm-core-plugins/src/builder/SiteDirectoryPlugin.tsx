import { type IUIPlugin, useApplication } from '@development-framework/dm-core'
import {
  Button,
  Dialog,
  Icon,
  Switch,
  Typography,
} from '@equinor/eds-core-react'
import {
  add,
  delete_to_trash,
  refresh,
  warning_outlined,
} from '@equinor/eds-icons'
import { useCallback, useEffect, useState } from 'react'
import { SiteCard, type TSiteHit } from './components/SiteCard'
import {
  createEmptySite,
  resolvePluginAliases,
  SITE_TYPE_ADDRESS,
  serializeSite,
  stampWidgetConfigTypes,
} from './model/site'
import * as S from './styles/directory.styles'
import type { TSiteDirectoryConfig } from './types/siteDirectory'

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

// ---- Directory plugin ---------------------------------------------------

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
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [pendingDeleteSite, setPendingDeleteSite] = useState<TSiteHit | null>(
    null
  )
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
      setDeleteError(null)
      const address = `dmss://${site.dataSource}/$${site.id}`
      try {
        // documentRemove takes a full DMSS address; root documents use the
        // `$id` syntax (the `$` is DMSS's root-id sigil, not a JS template).
        await dmssAPI.documentRemove({ address })
        setSites((current) => current.filter((s) => s.id !== site.id))
        setPendingDeleteSite(null)
      } catch (error) {
        // Sites saved before widget configs were stamped with a resolvable
        // `type` (see WIDGET_CONFIG_TYPE) can't be deleted: DMSS fails to build
        // the node-tree over their typeless configs. Self-heal such legacy
        // documents by re-storing them with stamped config types, then retry.
        try {
          const current = (await dmssAPI
            .documentGet({ address, depth: 0 })
            .then((response) => response.data)) as Record<string, unknown>
          stampWidgetConfigTypes(current)
          await dmssAPI.documentAddSimple({
            dataSourceId: site.dataSource,
            body: current,
          })
          await dmssAPI.documentRemove({ address })
          setSites((sites) => sites.filter((s) => s.id !== site.id))
          setPendingDeleteSite(null)
        } catch (retryError) {
          console.error('Failed to delete site', error, retryError)
          setDeleteError('Could not delete the site. Please try again.')
        }
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
    <S.Root className='dm-plugin-padding'>
      {/* EDS Dialog for delete confirmation */}
      <Dialog
        open={pendingDeleteSite !== null}
        isDismissable
        onClose={() => {
          if (deletingId === null) setPendingDeleteSite(null)
        }}
      >
        <Dialog.Header>
          <Dialog.Title>Delete website?</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
          <Typography variant='body_short'>
            Deleting <strong>{pendingDeleteSite?.label}</strong> is permanent.
            Are you sure you wish to delete it?
          </Typography>
          {deleteError ? (
            <S.DialogErrorText variant='body_short'>
              {deleteError}
            </S.DialogErrorText>
          ) : null}
        </Dialog.CustomContent>
        <S.DialogActions>
          <Button
            variant='outlined'
            onClick={() => setPendingDeleteSite(null)}
            disabled={deletingId !== null}
          >
            Cancel
          </Button>
          <Button
            color='danger'
            onClick={() =>
              pendingDeleteSite ? handleDelete(pendingDeleteSite) : undefined
            }
            disabled={deletingId !== null}
          >
            <Icon data={delete_to_trash} size={16} />
            {deletingId !== null ? 'Deleting…' : 'Delete'}
          </Button>
        </S.DialogActions>
      </Dialog>

      {/* Header row */}
      <S.HeaderRow>
        <Typography variant='h4'>{heading}</Typography>
        <S.HeaderActions>
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
        </S.HeaderActions>
      </S.HeaderRow>

      {createError ? (
        <S.CreateErrorText color='danger'>{createError}</S.CreateErrorText>
      ) : null}

      {status === 'loading' ? (
        <S.MutedText variant='body_short'>Loading websites…</S.MutedText>
      ) : null}

      {status === 'error' ? (
        <S.AlertRow role='alert'>
          <Icon data={warning_outlined} size={18} />
          <Typography variant='body_short'>
            Could not load websites. Check your data source access and try
            refreshing.
          </Typography>
        </S.AlertRow>
      ) : null}

      {status === 'ready' && sites.length === 0 ? (
        <S.EmptyState>
          <S.EmptyTitle variant='h5'>No websites yet</S.EmptyTitle>
          {allowCreate && target ? (
            <S.MutedText variant='body_short'>
              Click <strong>New site</strong> to create your first one.
            </S.MutedText>
          ) : null}
        </S.EmptyState>
      ) : null}

      {status === 'ready' && sites.length > 0 && visibleSites.length === 0 ? (
        <S.MutedText variant='body_short'>
          No published websites yet. Turn on "Show drafts" to see unpublished
          sites.
        </S.MutedText>
      ) : null}

      {status === 'ready' && visibleSites.length > 0 ? (
        <S.CardGrid>
          {visibleSites.map((site) => (
            <SiteCard
              key={site.address}
              site={site}
              viewUrl={viewUrl(site.dataSource, site.id)}
              editUrl={editUrl(site.dataSource, site.id)}
              onDeleteRequest={() => {
                setDeleteError(null)
                setPendingDeleteSite(site)
              }}
              deleting={deletingId === site.id}
            />
          ))}
        </S.CardGrid>
      ) : null}
    </S.Root>
  )
}
