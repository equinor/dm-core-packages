import React from 'react'
import { Typography } from '@equinor/eds-core-react'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import styled from 'styled-components'

export interface LogBlockProps {
  title?: string
  style?: Record<string, string | number>
  content: any
}

export const FormattedLogContainer = styled.pre`
  font-size: 0.8rem;
  line-height: normal;
  position: relative;
  background-color: #193549;
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #dcdde0;
  overflow: auto;

  & .hljs-string {
    color: #a5ff90;
  }

  & .hljs-literal,
  & .hljs-number {
    color: #f53b6e;
  }

  & .hljs-bullet {
    color: #99ffff;
  }
`

export const LogBlock = (props: LogBlockProps) => {
  const { title, content, style } = props

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography variant="h6" style={{ paddingBottom: '.4rem' }}>
          {title}:
        </Typography>
      </div>
      <FormattedLogContainer style={style}>
        <code
          dangerouslySetInnerHTML={{
            __html: hljs.highlight(
              DOMPurify.sanitize(JSON.stringify(content, null, 2)),
              {
                language: 'json',
              }
            ).value,
          }}
        />
      </FormattedLogContainer>
    </>
  )
}
