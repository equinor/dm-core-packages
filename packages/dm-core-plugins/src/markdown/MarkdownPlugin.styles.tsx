import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

const headingStyles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
  (heading) => `
    ${heading} {
      font-size: ${
        tokens.typography.heading[
          heading as keyof typeof tokens.typography.heading
        ].fontSize
      };
      font-weight: ${
        tokens.typography.heading[
          heading as keyof typeof tokens.typography.heading
        ].fontWeight
      };
      line-height: ${
        tokens.typography.heading[
          heading as keyof typeof tokens.typography.heading
        ].lineHeight
      };
      margin: 0;
    }
  `
)

export const StyledMarkdownWrapper = styled.div`
  ${headingStyles};

  h1 {
    margin: 1rem 0;
  }
  h2 {
    margin: 0.5rem 0;
  }
  h3,
  h4 {
    margin-bottom: 0.375rem;
  }
  h5,
  h6 {
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0 0 1rem;
  }

  ul,
  ol {
    margin-block-start: 0;
  }

  font-size: ${tokens.typography.paragraph.body_short.fontSize};
  line-height: ${tokens.typography.paragraph.body_short.lineHeight};

  blockquote {
    border-left: 4px solid ${tokens.colors.ui.background__medium.hex};
    margin: 0;
    padding-left: 1rem;
  }

  a {
    color: ${tokens.colors.interactive.primary__resting.hex};
    text-transform: underline;
  }

  pre {
    color: white;
    background-color: rgba(19, 38, 52, 1);
    margin: 0;
    padding: 1rem;
    border-radius: 0.5rem;
    width: 100%;
    margin-bottom: 1rem;
  }
  pre,
  code {
    font-size: 0.875rem;
    font-family: ui-monospace, "Cascadia Mono", "Segoe UI Mono",
      "Liberation Mono", Menlo, Monaco, Consolas, monospace;
  }

  table {
    min-width: min-content;
    margin-bottom: 1.25rem;
    th {
      text-align: left;
    }
    th,
    td {
      padding: 0.25rem;
      border-bottom: 1px solid ${tokens.colors.ui.background__medium.hex};
      border-right: 1px solid ${tokens.colors.ui.background__medium.hex};
    }
  }

  img {
    max-width: 100%;
  }

  .task-list-item {
    svg {
        margin-bottom: -7px;
        fill: ${tokens.colors.interactive.primary__resting.hex};
    }
  }
`
