import { Icon } from '@equinor/eds-core-react'

import { IconData } from '@equinor/eds-icons'
import { Name } from '@equinor/eds-core-react/dist/types/components/Icon/Icon.types'

type IconRecord = Record<Name, IconData>
const edsIcons: IconData[] = require('./eds-icons.json')
export const availableIcons: IconRecord = {}
edsIcons.forEach((item: IconData) => {
  availableIcons[item.name] = item
})

Icon.add(availableIcons)

export default Icon
// Usage example:
// <Icon name="info_circle" size={24} />
