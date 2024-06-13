import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Stack } from '../common'

export interface LogBlockProps {
  title?: string
  style?: Record<string, string | number>
  content: any
}

const FormattedLogContainer = styled.div`
  font-size: 0.8rem;
  line-height: normal;
  position: relative;
  background-color: #193549;
  margin: 0;
  max-height: 60vh;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #dcdde0;
  white-space: pre-wrap; 
  overflow-x: hidden;

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
  white-space: pre-wrap; 
`

export const LogBlock = (props: LogBlockProps) => {
  const { title, content, style } = props

  return (
    <Stack spacing={0.5}>
      <Typography variant='h6'>{title}:</Typography>
      <FormattedLogContainer style={style}>
        {content.constructor === Array ? (
          content.map((line) => <LogLine key={line}>{line}</LogLine>)
        ) : (
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(content, null, 2)}
          </pre>
        )}
      </FormattedLogContainer>
    </Stack>
  )
}
