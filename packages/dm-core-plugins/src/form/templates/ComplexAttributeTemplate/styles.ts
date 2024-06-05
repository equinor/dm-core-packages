import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

export const ComplexAttributeTemplate = styled.div`
    width: 100%;
    border: 1px solid #dddddd;
    border-radius: 0.375rem;
`

export const ComplexAttributeTemplateHeader = styled.div`
    display: flex;
    height: 2.5rem;
    justify-content: space-between;
    align-items: center;
    background: ${tokens.colors.ui.background__light.rgba};
    padding-right: 0.5rem;
    border-radius: inherit;
`

export type TComplexAttributeTemplateContent = {
  padding?: string
  expanded?: boolean
  canExpand?: boolean
  // Used to define aria-controls, should be [namePath]-content
  id: string
}

export const ComplexAttributeTemplateContent = styled.div<TComplexAttributeTemplateContent>`
    border-top: 1px solid #dddddd;
    padding: ${(props) => (props.padding ? props.padding : '0.5rem')};
    width: 100%;
    display: ${(props) =>
      !props.canExpand || !props.expanded ? 'none' : 'block'};
`

export const TitleButton = styled.button<{ isExpanded: boolean }>`
  width: 100%;
  background: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-right: 0.5rem;
  border-radius: 0.5rem;

  .title-chevron {
    padding: 0.25rem;
    border-radius: 50%;
    transform: ${(props) => (props.isExpanded ? 'rotate(90deg)' : 'none')};
    transition: all ease-in-out 0.2s;
    svg {
      fill: ${tokens.colors.interactive.primary__resting.rgba};
    }
  }

  .title-icon {
    margin: 0.25rem 0;
  }

  &:focus {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.rgba};
  }

  &:disabled {
    opacity: 0.7;
  }

  &:hover:enabled {
    p  {
      text-decoration: underline;
    }
    .title-chevron {
      background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }
  }
`
