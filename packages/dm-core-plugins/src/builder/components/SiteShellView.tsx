import { ErrorBoundary } from '@development-framework/dm-core'
import * as Styled from '../styles'

type SiteShellViewProps = {
  navbar: React.ReactNode
  navSidebar: React.ReactNode
  /** Message shown if a widget fails to render. */
  errorMessage: string
  /** When set, the page content is constrained to this width (device preview). */
  maxWidth?: string
  children: React.ReactNode
}

/**
 * Chrome-free rendering of the built site: the top navbar, the page nav sidebar
 * and the page content. Shared by the read-only viewer and the editor's preview
 * mode (which additionally constrains the width to emulate a device).
 */
export const SiteShellView = ({
  navbar,
  navSidebar,
  errorMessage,
  maxWidth,
  children,
}: SiteShellViewProps): React.ReactElement => {
  const content = (
    <ErrorBoundary message={errorMessage}>{children}</ErrorBoundary>
  )
  return (
    <Styled.FullBleedCanvasPanel>
      <Styled.SiteShell>
        {navbar}
        <Styled.SiteFrame>
          {navSidebar}
          <Styled.SitePageArea>
            {maxWidth ? (
              <Styled.DeviceFrame $maxWidth={maxWidth}>
                {content}
              </Styled.DeviceFrame>
            ) : (
              content
            )}
          </Styled.SitePageArea>
        </Styled.SiteFrame>
      </Styled.SiteShell>
    </Styled.FullBleedCanvasPanel>
  )
}
