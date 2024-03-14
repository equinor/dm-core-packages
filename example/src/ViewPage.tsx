import {
  EntityView,
  ErrorGroup,
  Loading,
  TValidEntity,
  useDocument,
} from '@development-framework/dm-core'
import { Typography } from '@equinor/eds-core-react'

function ViewPage() {
  const urlParams = new URLSearchParams(window.location.search)
  const idReference = urlParams.get('documentId')

  if (!idReference) throw new Error("No parameter 'documentId' in URL")

  const { document, isLoading, error } = useDocument<TValidEntity>(idReference)

  if (isLoading) return <Loading />

  if (error || !document) {
    console.error(error)
    return (
      <ErrorGroup>
        <Typography variant='h5' color='red'>
          Failed to load requested entity
        </Typography>
        <div
          style={{
            overflowWrap: 'break-word',
            fontFamily: 'monospace',
          }}
        >
          {error?.message || 'See console for details'}
        </div>
      </ErrorGroup>
    )
  }

  return <EntityView idReference={idReference} type={document.type} />
}

export default ViewPage
