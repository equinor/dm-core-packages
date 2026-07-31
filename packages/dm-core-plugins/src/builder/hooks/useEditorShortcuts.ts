import { useEffect } from 'react'

type UseEditorShortcutsArgs = {
  /** Shortcuts are active only while editing and not in the raw-JSON view. */
  enabled: boolean
  selectedIndex: number | null
  hasClipboard: boolean
  onUndo: () => void
  onRedo: () => void
  onCopy: (index: number) => void
  onPaste: () => void
  onDuplicate: (index: number) => void
  onDelete: (index: number) => void
  onDeselect: () => void
}

/**
 * Keyboard shortcuts for the editor. Undo/redo are available whenever editing
 * is active; the editing shortcuts (copy/paste/duplicate/delete/escape) are
 * ignored while typing in a form field so the field's own behaviour (text undo,
 * copy, etc.) keeps working.
 */
export const useEditorShortcuts = ({
  enabled,
  selectedIndex,
  hasClipboard,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onDeselect,
}: UseEditorShortcutsArgs): void => {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      const mod = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (mod && key === 'z') {
        if (typing) return
        event.preventDefault()
        if (event.shiftKey) onRedo()
        else onUndo()
        return
      }
      if (mod && key === 'y') {
        if (typing) return
        event.preventDefault()
        onRedo()
        return
      }

      if (typing) return

      if (mod && key === 'c') {
        if (selectedIndex !== null) onCopy(selectedIndex)
        return
      }
      if (mod && key === 'v') {
        if (hasClipboard) {
          event.preventDefault()
          onPaste()
        }
        return
      }
      if (mod && key === 'd') {
        if (selectedIndex !== null) {
          event.preventDefault()
          onDuplicate(selectedIndex)
        }
        return
      }
      if (key === 'delete' || key === 'backspace') {
        if (selectedIndex !== null) {
          event.preventDefault()
          onDelete(selectedIndex)
        }
        return
      }
      if (key === 'escape') onDeselect()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    enabled,
    selectedIndex,
    hasClipboard,
    onUndo,
    onRedo,
    onCopy,
    onPaste,
    onDuplicate,
    onDelete,
    onDeselect,
  ])
}
