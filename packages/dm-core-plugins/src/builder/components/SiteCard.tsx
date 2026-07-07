import { Button, Icon } from '@equinor/eds-core-react'
import { delete_to_trash, edit, external_link } from '@equinor/eds-icons'
import * as S from '../styles/directory.styles'

export type TSiteHit = {
  address: string
  dataSource: string
  id: string
  name: string
  /** Friendly display name; falls back to `name` (the slug) when unset. */
  label: string
  /** Whether the site is published (live) or still a draft. */
  published: boolean
}

type SiteCardProps = {
  site: TSiteHit
  viewUrl: string
  editUrl: string | null
  onDeleteRequest: () => void
  deleting: boolean
}

/**
 * Derive a deterministic hue (0–360) from a string so every card gets its
 * own colour without any runtime randomness that would shift on re-render.
 */
const hueFromString = (value: string): number => {
  let hue = 0
  for (let i = 0; i < value.length; i++)
    hue = (hue * 31 + value.charCodeAt(i)) & 0xffff
  return hue % 360
}

/** A single site tile in the directory gallery. */
export const SiteCard = ({
  site,
  viewUrl,
  editUrl,
  onDeleteRequest,
  deleting,
}: SiteCardProps): React.ReactElement => {
  const initial = (site.label[0] ?? '?').toUpperCase()

  return (
    <S.Card $deleting={deleting}>
      {/* Coloured banner with the site's initial letter */}
      <S.Banner $hue={hueFromString(site.id)}>
        <S.BannerInitial>{initial}</S.BannerInitial>
        {!site.published && <S.DraftBadge>Draft</S.DraftBadge>}
      </S.Banner>

      {/* Card body */}
      <S.CardBody>
        <S.CardTitle variant='h6' title={site.label}>
          {site.label}
        </S.CardTitle>
        <S.CardCaption variant='caption'>{site.dataSource}</S.CardCaption>

        {/* Action row */}
        <S.ActionRow>
          <S.OpenLink href={viewUrl}>
            <S.FullWidthButton variant='contained' disabled={deleting}>
              <Icon data={external_link} size={16} />
              Open
            </S.FullWidthButton>
          </S.OpenLink>
          {editUrl ? (
            <S.EditLink href={editUrl}>
              <Button
                variant='ghost_icon'
                aria-label='Edit site'
                disabled={deleting}
              >
                <Icon data={edit} size={18} />
              </Button>
            </S.EditLink>
          ) : null}
          <S.DangerIconButton
            variant='ghost_icon'
            aria-label='Delete site'
            title='Delete site'
            disabled={deleting}
            onClick={onDeleteRequest}
          >
            <Icon data={delete_to_trash} size={18} />
          </S.DangerIconButton>
        </S.ActionRow>
      </S.CardBody>
    </S.Card>
  )
}
