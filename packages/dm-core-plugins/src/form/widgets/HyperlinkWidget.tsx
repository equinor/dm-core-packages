import { Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { link } from '@equinor/eds-icons'
import { TWidget } from '../types'

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

  let url
  let label
  if (isComplex(value) && isUrl(value)) {
    url = value.value
    label = config?.label || value.label
  } else {
    url = value
    label = config?.label
  }
  url = ensureProtocol(url)
  return (
    <div
      style={{
        marginInlineStart: '4px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Tooltip title={url}>
        <a href={url}>
          <Typography color='blue' className='hover:underline flex' style={{}}>
            <Icon
              data={link}
              size={18}
              style={{ transform: 'rotate(315deg)' }}
              className='me-1'
            />
            {label ?? url}
          </Typography>
        </a>
      </Tooltip>
    </div>
  )
}

export default HyperlinkWidget
