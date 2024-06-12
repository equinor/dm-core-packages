import { Typography } from '@equinor/eds-core-react'
import { Stack } from '../../../common'

type MetaItemProps = {
  title: string
  value: string
}

export function MetaItem(props: MetaItemProps) {
  return (
    <Stack direction='row'>
      <Typography variant='h6' style={{ width: '50%' }}>
        {props.title}
      </Typography>
      <Typography style={{ width: '50%' }}>{props.value}</Typography>
    </Stack>
  )
}
