import { Button, Icon, Tooltip } from '@equinor/eds-core-react'
import { MAX_GRID_CELLS, MIN_GRID_CELLS } from '../model/model'
import * as Styled from '../styles'
import type {
  TBuilderMode,
  TBuilderModel,
  TBuilderPluginConfig,
} from '../types'
import { ICONS } from '../utils/icons'
import * as S from './BuilderToolbar.styles'
import { DENSITY_STEP } from './Canvas'
import { TemplatesMenu } from './TemplatesMenu'

export type TDevice = 'desktop' | 'tablet' | 'mobile'

export const DEVICE_WIDTHS: Record<TDevice, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '380px',
}

const DEVICE_ICONS: Record<TDevice, string> = {
  desktop: 'desktop_mac',
  tablet: 'tablet_android',
  mobile: 'phone',
}

type BuilderToolbarProps = {
  config?: TBuilderPluginConfig
  mode: TBuilderMode
  locked: boolean
  siteTitle: string
  published: boolean
  saveState: 'saved' | 'saving' | 'dirty'
  saveStatusLabel: string
  device: TDevice
  gridColumns: number
  gridRows: number
  showJson: boolean
  canUndo: boolean
  canRedo: boolean
  onSetMode: (mode: TBuilderMode) => void
  onRenameSite: (title: string) => void
  onCommit: () => void
  onUndo: () => void
  onRedo: () => void
  onTogglePublished: () => void
  onApplyTemplate: (build: () => TBuilderModel) => void
  onSave: () => void
  onSetDevice: (device: TDevice) => void
  onDensity: (factor: number) => void
  onToggleJson: () => void
}

/**
 * The builder's top toolbar: back link, site name/publish controls, undo/redo,
 * templates, save status, device widths, grid density and view switches.
 *
 * Purely presentational — every action is delegated to the container via props.
 */
export const BuilderToolbar = ({
  config,
  mode,
  locked,
  siteTitle,
  published,
  saveState,
  saveStatusLabel,
  device,
  gridColumns,
  gridRows,
  showJson,
  canUndo,
  canRedo,
  onSetMode,
  onRenameSite,
  onCommit,
  onUndo,
  onRedo,
  onTogglePublished,
  onApplyTemplate,
  onSave,
  onSetDevice,
  onDensity,
  onToggleJson,
}: BuilderToolbarProps): React.ReactElement => (
  <Styled.Toolbar>
    <Styled.ToolbarGroup>
      <S.BackButton
        type='button'
        aria-label='Back to site directory'
        onClick={() => {
          if (config?.directoryUrl) {
            window.location.assign(config.directoryUrl)
          } else {
            window.history.back()
          }
        }}
      >
        <S.BackTitle variant='h5'>Website builder</S.BackTitle>
      </S.BackButton>
      {mode === 'edit' && (
        <Tooltip title='Site name (shown in the site directory)'>
          <S.SiteNameInput
            aria-label='Site name'
            placeholder='Untitled site'
            value={siteTitle}
            disabled={locked}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onRenameSite(event.target.value)
            }
            onBlur={onCommit}
          />
        </Tooltip>
      )}
      {mode === 'edit' && !locked && (
        <Tooltip
          title={
            published
              ? 'Published — visitors can find this site. Click to unpublish.'
              : 'Draft — hidden from visitors. Click to publish.'
          }
        >
          <Button
            variant={published ? 'contained' : 'outlined'}
            aria-label={published ? 'Unpublish site' : 'Publish site'}
            aria-pressed={published}
            onClick={onTogglePublished}
          >
            <Icon
              data={published ? ICONS.visibility : ICONS.visibility_off}
              size={18}
            />
            {published ? 'Published' : 'Publish'}
          </Button>
        </Tooltip>
      )}
      {mode === 'edit' && (
        <TemplatesMenu
          onApply={(template) => onApplyTemplate(template.build)}
        />
      )}
      {mode === 'edit' && (
        <>
          <Tooltip title='Undo (Ctrl/Cmd+Z)'>
            <Button
              variant='ghost_icon'
              aria-label='Undo'
              disabled={!canUndo}
              onClick={onUndo}
            >
              <Icon data={ICONS.undo} size={18} />
            </Button>
          </Tooltip>
          <Tooltip title='Redo (Ctrl/Cmd+Shift+Z)'>
            <Button
              variant='ghost_icon'
              aria-label='Redo'
              disabled={!canRedo}
              onClick={onRedo}
            >
              <Icon data={ICONS.redo} size={18} />
            </Button>
          </Tooltip>
        </>
      )}
    </Styled.ToolbarGroup>
    <Styled.ToolbarGroup>
      {mode === 'edit' && (
        <Styled.SaveStatus $state={saveState}>
          {saveStatusLabel}
        </Styled.SaveStatus>
      )}
      {mode === 'edit' && (
        <Button
          variant='outlined'
          disabled={saveState === 'saved'}
          onClick={onSave}
        >
          <Icon data={ICONS.save} size={18} />
          Save
        </Button>
      )}
      {(['desktop', 'tablet', 'mobile'] as TDevice[]).map((value) => (
        <Button
          key={value}
          variant={device === value ? 'contained_icon' : 'ghost_icon'}
          aria-label={`${value} width`}
          aria-pressed={device === value}
          onClick={() => onSetDevice(value)}
        >
          <Icon data={ICONS[DEVICE_ICONS[value]]} size={18} />
        </Button>
      ))}
      {mode === 'edit' && (
        <>
          <Tooltip title='Coarser grid (fewer cells)'>
            <Button
              variant='ghost_icon'
              aria-label='decrease grid density'
              disabled={
                gridColumns <= MIN_GRID_CELLS && gridRows <= MIN_GRID_CELLS
              }
              onClick={() => onDensity(1 / DENSITY_STEP)}
            >
              <Icon data={ICONS.zoom_out} size={18} />
            </Button>
          </Tooltip>
          <Tooltip title='Grid density (Ctrl/Cmd + scroll to zoom)'>
            <S.DensityReadout>
              {gridColumns}×{gridRows}
            </S.DensityReadout>
          </Tooltip>
          <Tooltip title='Finer grid (more cells, micro adjustments)'>
            <Button
              variant='ghost_icon'
              aria-label='increase grid density'
              disabled={
                gridColumns >= MAX_GRID_CELLS && gridRows >= MAX_GRID_CELLS
              }
              onClick={() => onDensity(DENSITY_STEP)}
            >
              <Icon data={ICONS.zoom_in} size={18} />
            </Button>
          </Tooltip>
        </>
      )}
      <Button
        variant={showJson ? 'contained' : 'outlined'}
        onClick={onToggleJson}
      >
        Advanced: JSON
      </Button>
      <Button
        variant={mode === 'edit' ? 'contained' : 'outlined'}
        onClick={() => onSetMode('edit')}
      >
        <Icon data={ICONS.edit} size={18} />
        Edit
      </Button>
      <Button
        variant={mode === 'preview' ? 'contained' : 'outlined'}
        onClick={() => onSetMode('preview')}
      >
        <Icon data={ICONS.visibility} size={18} />
        Preview
      </Button>
    </Styled.ToolbarGroup>
  </Styled.Toolbar>
)
