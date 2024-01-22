import { Icon, Tooltip, Typography } from '@equinor/eds-core-react'
import { link } from '@equinor/eds-icons'
import { TWidget } from '../types'

function ensureProtocol(url: string): string {
  if (!url.includes('://')) {
    return 'https://' + url
  }
  return url
}

const HyperlinkWidget = (props: TWidget) => {
  const { value, config } = props

  const url = ensureProtocol(value)
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
            {config?.label ?? url}
          </Typography>
        </a>
      </Tooltip>
    </div>
  )
}

export default HyperlinkWidget
