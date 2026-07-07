import { Icon } from '@equinor/eds-core-react'
import { useEffect, useRef, useState } from 'react'
import type {
  TBuilderPage,
  TNavbar,
  TNavbarItem,
  TNavbarItemTarget,
} from '../model/site'
import * as Styled from '../styles'
import { ICONS } from '../utils/icons'
import * as S from './Navbar.styles'

/** Flatten the page tree to `{ id, label }` options for the target selector. */
const flattenPages = (
  pages: TBuilderPage[],
  depth = 0
): { id: string; label: string }[] =>
  pages.flatMap((page) => [
    { id: page.id, label: `${'\u00A0\u00A0'.repeat(depth)}${page.title}` },
    ...flattenPages(page.children, depth + 1),
  ])

type TNavbarProps = {
  navbar: TNavbar
  pages: TBuilderPage[]
  editing: boolean
  onNavigate: (pageId: string) => void
  onUpdateNavbar: (patch: Partial<TNavbar>) => void
  onAddItem: () => void
  onUpdateItem: (id: string, patch: Partial<TNavbarItem>) => void
  onRemoveItem: (id: string) => void
  onReorderItem: (from: number, to: number) => void
}

/**
 * The site's customizable full-width top navbar, shared by every page and
 * rendered in both edit and preview so the canvas stays WYSIWYG.
 *
 * - Preview: brand text plus clickable links. Page links navigate within the
 *   site (SPA-style); URL links open in a new tab.
 * - Edit: the brand is editable inline, each link can be renamed, re-targeted
 *   (to a page or an external URL), deleted, and reordered by dragging; a
 *   settings popover exposes colors, alignment, and disabling the navbar.
 * - Disabled: in edit mode an "Add navbar" affordance lets the author opt in;
 *   in preview the navbar renders nothing so existing sites are unchanged.
 */
export const Navbar = ({
  navbar,
  pages,
  editing,
  onNavigate,
  onUpdateNavbar,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onReorderItem,
}: TNavbarProps): React.ReactElement | null => {
  const [editingBrand, setEditingBrand] = useState(false)
  const [brandDraft, setBrandDraft] = useState(navbar.brand)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [labelDraft, setLabelDraft] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const brandRef = useRef<HTMLInputElement | null>(null)
  const labelRef = useRef<HTMLInputElement | null>(null)
  const settingsRef = useRef<HTMLDivElement | null>(null)
  const settingsPanelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (editingBrand) brandRef.current?.focus()
  }, [editingBrand])

  useEffect(() => {
    if (renamingId) labelRef.current?.focus()
  }, [renamingId])

  // Move focus into the settings popover when it opens so keyboard users land
  // inside it (and Escape-to-close works).
  useEffect(() => {
    if (settingsOpen) settingsPanelRef.current?.focus()
  }, [settingsOpen])

  // Close the settings popover when clicking outside of it.
  useEffect(() => {
    if (!settingsOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [settingsOpen])

  if (!navbar.enabled) {
    if (!editing) return null
    return (
      <Styled.NavbarEmptyAffordance
        type='button'
        onClick={() => onUpdateNavbar({ enabled: true })}
      >
        <Icon data={ICONS.add} size={18} />
        Add a top navbar
      </Styled.NavbarEmptyAffordance>
    )
  }

  const pageOptions = flattenPages(pages)

  const commitBrand = () => {
    const brand = brandDraft.trim()
    if (brand) onUpdateNavbar({ brand })
    else setBrandDraft(navbar.brand)
    setEditingBrand(false)
  }

  const startRename = (item: TNavbarItem) => {
    setRenamingId(item.id)
    setLabelDraft(item.label)
  }

  const commitRename = () => {
    if (renamingId) {
      const label = labelDraft.trim()
      if (label) onUpdateItem(renamingId, { label })
    }
    setRenamingId(null)
  }

  const changeTargetKind = (
    item: TNavbarItem,
    kind: TNavbarItemTarget['kind']
  ) => {
    if (kind === item.target.kind) return
    const target: TNavbarItemTarget =
      kind === 'url'
        ? { kind: 'url', href: '' }
        : { kind: 'page', pageId: pages[0]?.id ?? '' }
    onUpdateItem(item.id, { target })
  }

  const activate = (item: TNavbarItem) => {
    if (item.target.kind === 'page') {
      if (item.target.pageId) onNavigate(item.target.pageId)
    } else if (item.target.href) {
      window.open(item.target.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Styled.Navbar $background={navbar.background} $color={navbar.color}>
      {editing && editingBrand ? (
        <Styled.NavbarBrandInput
          ref={brandRef}
          value={brandDraft}
          onChange={(event) => setBrandDraft(event.target.value)}
          onBlur={commitBrand}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitBrand()
            if (event.key === 'Escape') {
              setBrandDraft(navbar.brand)
              setEditingBrand(false)
            }
          }}
        />
      ) : (
        <S.NavbarBrand
          $color={navbar.brandColor}
          $editing={editing}
          onClick={() => {
            if (editing) {
              setBrandDraft(navbar.brand)
              setEditingBrand(true)
            }
          }}
          title={editing ? 'Click to edit brand' : undefined}
        >
          {navbar.brand}
        </S.NavbarBrand>
      )}

      <Styled.NavbarItems $align={navbar.align}>
        {navbar.items.map((item, index) => {
          if (!editing) {
            return (
              <Styled.NavbarLink
                key={item.id}
                type='button'
                $color={navbar.color}
                onClick={() => activate(item)}
              >
                {item.label}
                {item.target.kind === 'url' && (
                  <Icon data={ICONS.external_link} size={16} />
                )}
              </Styled.NavbarLink>
            )
          }

          const isRenaming = renamingId === item.id
          return (
            <Styled.NavbarItemEditor
              key={item.id}
              $dragging={dragIndex === index}
              onDragOver={(event) => {
                if (dragIndex === null) return
                event.preventDefault()
              }}
              onDrop={(event) => {
                if (dragIndex === null) return
                event.preventDefault()
                if (dragIndex !== index) onReorderItem(dragIndex, index)
                setDragIndex(null)
              }}
            >
              <Styled.NavDragHandle
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragEnd={() => setDragIndex(null)}
                aria-label={`Reorder ${item.label}`}
              >
                <Icon data={ICONS.drag_handle} size={16} />
              </Styled.NavDragHandle>

              {isRenaming ? (
                <Styled.NavbarItemInput
                  ref={labelRef}
                  value={labelDraft}
                  onChange={(event) => setLabelDraft(event.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') commitRename()
                    if (event.key === 'Escape') setRenamingId(null)
                  }}
                />
              ) : (
                <S.LabelButton
                  type='button'
                  onClick={() => startRename(item)}
                  title='Rename link'
                >
                  {item.label}
                </S.LabelButton>
              )}

              <Styled.NavbarTargetSelect
                value={
                  item.target.kind === 'url' ? '__url__' : item.target.pageId
                }
                aria-label={`Target for ${item.label}`}
                onChange={(event) => {
                  const value = event.target.value
                  if (value === '__url__') {
                    changeTargetKind(item, 'url')
                  } else {
                    onUpdateItem(item.id, {
                      target: { kind: 'page', pageId: value },
                    })
                  }
                }}
              >
                {pageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
                <option value='__url__'>External URL…</option>
              </Styled.NavbarTargetSelect>

              {item.target.kind === 'url' && (
                <Styled.NavbarUrlInput
                  value={item.target.href}
                  placeholder='https://…'
                  aria-label={`URL for ${item.label}`}
                  onChange={(event) =>
                    onUpdateItem(item.id, {
                      target: { kind: 'url', href: event.target.value },
                    })
                  }
                />
              )}

              <S.IconButton
                type='button'
                aria-label={`Delete ${item.label}`}
                title='Delete link'
                onClick={() => onRemoveItem(item.id)}
              >
                <Icon data={ICONS.close} size={16} />
              </S.IconButton>
            </Styled.NavbarItemEditor>
          )
        })}

        {editing && (
          <Styled.NavbarAddButton type='button' onClick={onAddItem}>
            <Icon data={ICONS.add} size={16} />
            Add link
          </Styled.NavbarAddButton>
        )}
      </Styled.NavbarItems>

      {editing && (
        <Styled.NavbarSettings ref={settingsRef}>
          <S.IconButton
            type='button'
            aria-label='Navbar settings'
            aria-haspopup='dialog'
            aria-expanded={settingsOpen}
            title='Navbar settings'
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <Icon data={ICONS.settings} size={18} />
          </S.IconButton>

          {settingsOpen && (
            <Styled.NavbarSettingsPanel
              ref={settingsPanelRef}
              role='dialog'
              aria-label='Navbar settings'
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSettingsOpen(false)
              }}
            >
              <Styled.NavbarSettingsRow>
                Background
                <input
                  type='color'
                  value={navbar.background}
                  onChange={(event) =>
                    onUpdateNavbar({ background: event.target.value })
                  }
                />
              </Styled.NavbarSettingsRow>
              <Styled.NavbarSettingsRow>
                Text color
                <input
                  type='color'
                  value={navbar.color}
                  onChange={(event) =>
                    onUpdateNavbar({ color: event.target.value })
                  }
                />
              </Styled.NavbarSettingsRow>
              <Styled.NavbarSettingsRow>
                Brand color
                <input
                  type='color'
                  value={navbar.brandColor}
                  onChange={(event) =>
                    onUpdateNavbar({ brandColor: event.target.value })
                  }
                />
              </Styled.NavbarSettingsRow>
              <Styled.NavbarSettingsRow>
                Align
                <select
                  value={navbar.align}
                  onChange={(event) =>
                    onUpdateNavbar({
                      align: event.target.value as TNavbar['align'],
                    })
                  }
                >
                  <option value='left'>Left</option>
                  <option value='center'>Center</option>
                  <option value='right'>Right</option>
                </select>
              </Styled.NavbarSettingsRow>
              <S.RemoveButton
                type='button'
                onClick={() => {
                  onUpdateNavbar({ enabled: false })
                  setSettingsOpen(false)
                }}
              >
                Remove navbar
              </S.RemoveButton>
            </Styled.NavbarSettingsPanel>
          )}
        </Styled.NavbarSettings>
      )}
    </Styled.Navbar>
  )
}
