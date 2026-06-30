import type { IUIPlugin } from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import { createElement } from 'react'
import {
  aggregate,
  formatNumber,
  parseNumbers,
  type TAggregation,
} from './mathUtils'

/**
 * Self-contained "static" widgets for the website builder. Each renders purely
 * from its inline recipe config — no DMSS entity binding required — so authored
 * pages render WYSIWYG in both the builder preview and when published.
 *
 * These mirror the StaticTablePlugin pattern: a plain component reading typed
 * config, registered in `src/index.tsx` and surfaced as a palette block in
 * `builder/blocks.ts`.
 */

type TAlign = 'left' | 'center' | 'right'

const alignToFlex = (
  align: TAlign | undefined
): React.CSSProperties['justifyContent'] =>
  align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'

// ---- Heading --------------------------------------------------------------

export interface StaticHeadingPluginConfig {
  text?: string
  /** 1–6; drives the rendered heading tag and default size. */
  level?: number
  align?: TAlign
  color?: string
}

const HEADING_SIZES: Record<number, string> = {
  1: '40px',
  2: '32px',
  3: '26px',
  4: '21px',
  5: '17px',
  6: '14px',
}

/** A page heading/title rendered from inline config. */
export const StaticHeadingPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticHeadingPluginConfig }
): React.ReactElement => {
  const { text = 'Heading', level = 2, align = 'left', color } = props.config
  const safeLevel = Math.min(6, Math.max(1, Math.round(level)))

  return (
    <div className='dm-plugin-padding' style={{ width: '100%' }}>
      {createElement(
        `h${safeLevel}`,
        {
          style: {
            margin: 0,
            textAlign: align,
            color,
            fontSize: HEADING_SIZES[safeLevel],
            fontWeight: 600,
            lineHeight: 1.2,
          },
        },
        text
      )}
    </div>
  )
}

// ---- Button ---------------------------------------------------------------

export interface StaticButtonPluginConfig {
  label?: string
  href?: string
  variant?: 'contained' | 'outlined' | 'ghost'
  align?: TAlign
  openInNewTab?: boolean
}

/** A call-to-action button/link rendered from inline config. */
export const StaticButtonPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticButtonPluginConfig }
): React.ReactElement => {
  const {
    label = 'Button',
    href = '',
    variant = 'contained',
    align = 'left',
    openInNewTab = false,
  } = props.config

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: alignToFlex(align),
        width: '100%',
        height: '100%',
      }}
    >
      <Button
        variant={variant}
        href={href || undefined}
        target={href && openInNewTab ? '_blank' : undefined}
        rel={href && openInNewTab ? 'noopener noreferrer' : undefined}
        style={{ overflow: 'hidden' }}
      >
        {label}
      </Button>
    </div>
  )
}

// ---- Divider --------------------------------------------------------------

export interface StaticDividerPluginConfig {
  color?: string
  /** Line thickness in pixels. */
  thickness?: number
  /** Vertical space above and below the line, in pixels. */
  spacing?: number
}

/** A horizontal rule to separate sections. */
export const StaticDividerPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticDividerPluginConfig }
): React.ReactElement => {
  const { color = '#d8d8d8', thickness = 1, spacing = 8 } = props.config
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: `${spacing}px 0`,
        boxSizing: 'border-box',
      }}
    >
      <hr
        style={{
          width: '100%',
          border: 'none',
          borderTop: `${thickness}px solid ${color}`,
          margin: 0,
        }}
      />
    </div>
  )
}

// ---- Spacer ---------------------------------------------------------------

export interface StaticSpacerPluginConfig {
  /** Height of the empty space, in pixels. */
  height?: number
}

/** Empty vertical whitespace for spacing out content. */
export const StaticSpacerPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticSpacerPluginConfig }
): React.ReactElement => {
  const { height = 24 } = props.config
  return <div style={{ width: '100%', height }} aria-hidden />
}

// ---- Video / Embed --------------------------------------------------------

export interface StaticEmbedPluginConfig {
  url?: string
  title?: string
}

/**
 * Convert common share URLs (YouTube, Vimeo) into their embeddable form. Any
 * other URL is embedded as-is, so generic iframes still work.
 */
const toEmbedUrl = (url: string): string => {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    return url
  } catch {
    return url
  }
}

/** Embed a video or other external page via a responsive 16:9 iframe. */
export const StaticEmbedPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticEmbedPluginConfig }
): React.ReactElement => {
  const { url = '', title = 'Embedded content' } = props.config

  if (!url)
    return (
      <div style={{ padding: 16, color: '#6f6f6f', textAlign: 'center' }}>
        Paste a video or page URL in the inspector to embed it.
      </div>
    )

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
      }}
    >
      <iframe
        src={toEmbedUrl(url)}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 4,
        }}
      />
    </div>
  )
}

// ---- Metric / KPI ---------------------------------------------------------

export interface StaticMetricPluginConfig {
  label?: string
  /** Free-form text; all numbers found are extracted and aggregated. */
  values?: string
  aggregation?: TAggregation
  unit?: string
  decimals?: number
  color?: string
  align?: TAlign
}

/**
 * A single big-number KPI. Reads numbers out of `values`, reduces them with the
 * chosen aggregation (mean, sum, min, max, …) and renders the result with an
 * optional label and unit. Self-contained — no DMSS binding required.
 */
export const StaticMetricPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: StaticMetricPluginConfig }
): React.ReactElement => {
  const {
    label = 'Metric',
    values = '',
    aggregation = 'mean',
    unit = '',
    decimals = 2,
    color = '#243746',
    align = 'left',
  } = props.config

  const numbers = parseNumbers(values)
  const result = aggregate(numbers, aggregation)
  const display = numbers.length === 0 ? '–' : formatNumber(result, decimals)

  return (
    <div
      className='dm-plugin-padding'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:
          align === 'center'
            ? 'center'
            : align === 'right'
              ? 'flex-end'
              : 'flex-start',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#6f6f6f',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.1,
          color,
        }}
      >
        {display}
        {unit ? (
          <span style={{ fontSize: 20, fontWeight: 500, marginLeft: 4 }}>
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  )
}
