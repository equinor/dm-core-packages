import React from 'react'
import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

export interface LogBlockProps {
  title?: string
  style?: Record<string, string | number>
  content: any
}

const FormattedLogContainer = styled.pre`
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

const LogLine = styled.pre`
  &:hover {
    background-color: #316082;
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
        <Typography variant='h6' style={{ paddingBottom: '.4rem' }}>
          {title}:
        </Typography>
      </div>
      <FormattedLogContainer style={style}>
        {content.constructor === Array ? (
          content.map((line) => <LogLine key={line}>{line}</LogLine>)
        ) : (
          <pre>{JSON.stringify(content, null, 2)}</pre>
        )}
      </FormattedLogContainer>
    </>
  )
}
