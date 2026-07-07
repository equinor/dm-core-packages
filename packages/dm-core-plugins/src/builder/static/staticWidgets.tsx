import type { IUIPlugin } from '@development-framework/dm-core'
import { createElement } from 'react'
import {
  aggregate,
  formatNumber,
  parseNumbers,
  type TAggregation,
} from '../utils/mathUtils'
import * as S from './staticWidgets.styles'

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
    <S.FullWidth className='dm-plugin-padding'>
      {createElement(
        S.Heading,
        {
          as: `h${safeLevel}`,
          $align: align,
          $color: color,
          $fontSize: HEADING_SIZES[safeLevel],
        },
        text
      )}
    </S.FullWidth>
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
    <S.ButtonContainer $justifyContent={alignToFlex(align)}>
      <S.OverflowHiddenButton
        variant={variant}
        href={href || undefined}
        target={href && openInNewTab ? '_blank' : undefined}
        rel={href && openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {label}
      </S.OverflowHiddenButton>
    </S.ButtonContainer>
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
    <S.DividerContainer $spacing={spacing}>
      <S.DividerLine $color={color} $thickness={thickness} />
    </S.DividerContainer>
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
  return <S.Spacer $height={height} aria-hidden />
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
      <S.EmptyMessage>
        Paste a video or page URL in the inspector to embed it.
      </S.EmptyMessage>
    )

  return (
    <S.EmbedFrame>
      <S.EmbedIframe
        src={toEmbedUrl(url)}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </S.EmbedFrame>
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
    <S.MetricContainer
      className='dm-plugin-padding'
      $alignItems={
        align === 'center'
          ? 'center'
          : align === 'right'
            ? 'flex-end'
            : 'flex-start'
      }
    >
      <S.MetricLabel>{label}</S.MetricLabel>
      <S.MetricValue $color={color}>
        {display}
        {unit ? <S.MetricUnit>{unit}</S.MetricUnit> : null}
      </S.MetricValue>
    </S.MetricContainer>
  )
}
