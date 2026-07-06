import { Icon } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { useEffect, useRef, useState } from 'react'
import { ICONS } from '../icons'
import type { TBuilderPage } from '../site'
import * as Styled from '../styles'

/** Ids of every ancestor of `targetId` within `pages` (root-most first). */
const ancestorIds = (pages: TBuilderPage[], targetId: string): string[] => {
  const walk = (siblings: TBuilderPage[], trail: string[]): string[] | null => {
    for (const page of siblings) {
      if (page.id === targetId) return trail
      const found = walk(page.children, [...trail, page.id])
      if (found) return found
    }
    return null
  }
  return walk(pages, []) ?? []
}

type TDrag = { parentId: string | null; index: number }

type TNavSidebarProps = {
  pages: TBuilderPage[]
  activePageId: string
  editing: boolean
  onNavigate: (id: string) => void
  onAddPage: (parentId: string | null) => void
  onRenamePage: (id: string, title: string) => void
  onDeletePage: (id: string) => void
  onReorder: (parentId: string | null, from: number, to: number) => void
}

/**
 * The website's own left navigation, rendered as an infinitely nestable menu
 * tree in both edit and preview so the canvas is WYSIWYG.
 *
 * - Preview: clicking a page navigates to it (client-side, SPA-style); pages
 *   with sub-pages can be expanded to reveal their nested menu.
 * - Edit: clicking a page switches the canvas to that page; pages can be added
 *   (as top-level pages or sub-pages of any page), renamed inline, deleted, and
 *   reordered by dragging within their level.
 */
export const NavSidebar = ({
  pages,
  activePageId,
  editing,
  onNavigate,
  onAddPage,
  onRenamePage,
  onDeletePage,
  onReorder,
}: TNavSidebarProps): React.ReactElement => {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [drag, setDrag] = useState<TDrag | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (renamingId) inputRef.current?.focus()
  }, [renamingId])

  // Keep the active page reachable by expanding all of its ancestors.
  useEffect(() => {
    const ancestors = ancestorIds(pages, activePageId)
    if (ancestors.length === 0) return
    setCollapsed((current) => {
      if (!ancestors.some((id) => current.has(id))) return current
      const next = new Set(current)
      for (const id of ancestors) next.delete(id)
      return next
    })
  }, [pages, activePageId])

  const startRename = (page: TBuilderPage) => {
    setRenamingId(page.id)
    setDraftTitle(page.title)
  }

  const commitRename = () => {
    if (renamingId) {
      const title = draftTitle.trim()
      if (title) onRenamePage(renamingId, title)
    }
    setRenamingId(null)
  }

  const toggleCollapsed = (id: string) =>
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const renderPages = (
    siblings: TBuilderPage[],
    parentId: string | null,
    depth: number
  ): React.ReactElement[] =>
    siblings.flatMap((page, index) => {
      const active = page.id === activePageId
      const isRenaming = renamingId === page.id
      const hasChildren = page.children.length > 0
      const expanded = hasChildren && !collapsed.has(page.id)

      const row = (
        <Styled.NavItem
          key={page.id}
          $active={active}
          $dragging={drag?.parentId === parentId && drag?.index === index}
          style={{ paddingLeft: 8 + depth * 14 }}
          onClick={() => {
            if (!isRenaming) onNavigate(page.id)
          }}
          onDragOver={(event) => {
            if (!editing || !drag || drag.parentId !== parentId) return
            event.preventDefault()
          }}
          onDrop={(event) => {
            if (!editing || !drag || drag.parentId !== parentId) return
            event.preventDefault()
            if (drag.index !== index) onReorder(parentId, drag.index, index)
            setDrag(null)
          }}
        >
          {editing && !isRenaming && (
            <Styled.NavDragHandle
              draggable
              onClick={(event) => event.stopPropagation()}
              onDragStart={() => setDrag({ parentId, index })}
              onDragEnd={() => setDrag(null)}
              aria-label={`Reorder ${page.title}`}
            >
              <Icon data={ICONS.drag_handle} size={16} />
            </Styled.NavDragHandle>
          )}

          {hasChildren ? (
            <Styled.NavDisclosure
              type='button'
              $expanded={expanded}
              aria-label={expanded ? 'Collapse' : 'Expand'}
              aria-expanded={expanded}
              onClick={(event) => {
                event.stopPropagation()
                toggleCollapsed(page.id)
              }}
            >
              <Icon data={ICONS.chevron_right} size={16} />
            </Styled.NavDisclosure>
          ) : (
            <Styled.NavDisclosureSpacer />
          )}

          {isRenaming ? (
            <Styled.NavRenameInput
              ref={inputRef}
              value={draftTitle}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setDraftTitle(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitRename()
                if (event.key === 'Escape') setRenamingId(null)
              }}
            />
          ) : (
            <Styled.NavItemLabel>{page.title}</Styled.NavItemLabel>
          )}

          {editing && !isRenaming && (
            <Styled.NavItemActions>
              <button
                type='button'
                aria-label={`Add sub-page to ${page.title}`}
                title='Add sub-page'
                onClick={(event) => {
                  event.stopPropagation()
                  setCollapsed((current) => {
                    const next = new Set(current)
                    next.delete(page.id)
                    return next
                  })
                  onAddPage(page.id)
                }}
                style={iconButtonStyle(active)}
              >
                <Icon data={ICONS.add} size={16} />
              </button>
              <button
                type='button'
                aria-label={`Rename ${page.title}`}
                title='Rename'
                onClick={(event) => {
                  event.stopPropagation()
                  startRename(page)
                }}
                style={iconButtonStyle(active)}
              >
                <Icon data={ICONS.edit} size={16} />
              </button>
              {!(parentId === null && pages.length <= 1) && (
                <button
                  type='button'
                  aria-label={`Delete ${page.title}`}
                  title='Delete'
                  onClick={(event) => {
                    event.stopPropagation()
                    onDeletePage(page.id)
                  }}
                  style={iconButtonStyle(active)}
                >
                  <Icon data={ICONS.close} size={16} />
                </button>
              )}
            </Styled.NavItemActions>
          )}
        </Styled.NavItem>
      )

      return expanded
        ? [row, ...renderPages(page.children, page.id, depth + 1)]
        : [row]
    })

  return (
    <Styled.NavSidebar $editing={editing}>
      <Styled.NavHeader>
        <span>{editing ? 'Pages' : 'Menu'}</span>
      </Styled.NavHeader>

      <Styled.NavList>{renderPages(pages, null, 0)}</Styled.NavList>

      {editing && (
        <Styled.NavAddButton type='button' onClick={() => onAddPage(null)}>
          <Icon data={ICONS.add} size={16} />
          Add page
        </Styled.NavAddButton>
      )}
    </Styled.NavSidebar>
  )
}

const iconButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 2,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: active
    ? tokens.colors.text.static_icons__primary_white.hex
    : tokens.colors.text.static_icons__tertiary.hex,
})
