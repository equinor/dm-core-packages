import { Tooltip, Typography } from '@equinor/eds-core-react'
import { type HTMLAttributeAnchorTarget, useMemo } from 'react'
import type { TWidget } from '../types'

type HyperlinkWidgetConfig = {
  label?: string
  target?: HTMLAttributeAnchorTarget
  download?: boolean
  customDownloadFilename?: string
}

const defaultConfig = {
  label: undefined,
  target: '_self',
  download: false,
  customDownloadFilename: undefined,
}

const HyperlinkWidget = (props: TWidget) => {
  const { value, config } = props
  const widgetConfig: HyperlinkWidgetConfig = { ...defaultConfig, ...config }

  const [url, label, rel] = useMemo(() => {
    const url = typeof value === 'object' ? value?.value : value
    const label = widgetConfig?.label || value.label || url
    const rel = url.includes('http') ? 'noopener noreferrer' : ''
    return [url, label, rel]
  }, [value, widgetConfig])

  return (
    <Tooltip title={url}>
      <Typography
        as='a'
        variant='body_short_link'
        style={{ display: 'inline-block', cursor: 'pointer' }}
        token={{ textDecoration: 'underline', fontWeight: 500 }}
        href={url}
        target={widgetConfig.target}
        rel={rel}
        download={widgetConfig.customDownloadFilename || widgetConfig.download}
      >
        {label ?? url}
      </Typography>
    </Tooltip>
  )
}

export default HyperlinkWidget
