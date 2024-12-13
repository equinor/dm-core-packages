import { Tooltip, Typography } from '@equinor/eds-core-react'
import type { TWidget } from '../types'

function ensureProtocol(url: string): string {
  if (!url.includes('://')) {
    return 'https://' + url
  }
  return url
}

function isComplex(value: string | object) {
  if (typeof value === 'object') return true
  if (typeof value === 'string') return false
  throw new Error('Invalid data type of value')
}

function isUrl(value: any): value is Url {
  return (
    value &&
    typeof (value.value === 'string') &&
    (typeof (value.label === 'string') || typeof value.label === 'undefined')
  )
}

type Url = {
  value: string
  label?: string
}

const HyperlinkWidget = (props: TWidget) => {
  const { value, config } = props

  let url: string
  let label: string
  if (isComplex(value) && isUrl(value)) {
    url = value.value
    label = config?.label || value.label
  } else {
    url = value
    label = config?.label
  }
  url = ensureProtocol(url)

  return (
    <Tooltip title={url}>
      <a href={url} style={{ display: 'inline-block' }}>
        <Typography
          color='primary'
          token={{ textDecoration: 'underline', fontWeight: 500 }}
        >
          {label ?? url}
        </Typography>
      </a>
    </Tooltip>
  )
}

export default HyperlinkWidget
