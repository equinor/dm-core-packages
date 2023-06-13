import { Tabs } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

export const StyledTabs = styled(Tabs)`
  .tabs-group-wrapper {
    display: flex;
    &:hover {
      .tabs-group-tab {
        background: ${tokens.colors.interactive.primary__hover_alt.hex};
      }
      .tabs-group-close-button {
        background: ${tokens.colors.interactive.primary__hover_alt.hex};
      }
    }
    .tabs-group-close-button {
      padding: 0 0.5rem 0 0;
      svg {
        border-radius: 50%;
      }
      &:hover {
        svg {
          background: ${tokens.colors.infographic.primary__moss_green_34.hex};
        }
      }
    }
  }
`
