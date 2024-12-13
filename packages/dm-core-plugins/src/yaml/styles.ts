import styled, { css } from 'styled-components'

export const ActionsWrapper = styled.div`
    position: sticky;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    top: 0;
    right: 0;
`

export const ActionButton = styled.button<{ $bg?: 'green' | 'yellow' }>`
    position: relative;
    width: 3rem;
    height: 3rem;
    color: white;
    padding: 0.5rem;
    background: rgba(173, 226, 230, 0.1);
    border: none;
    border-radius: 50px;
    font-weight: 900;
    font-size:0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    ${({ $bg }) =>
      $bg === 'green' &&
      css`
        background: rgba(193, 231, 193, 1);
        color: rgba(19, 38, 52, 1);
    `}
    ${({ $bg }) =>
      $bg === 'yellow' &&
      css`
        background: rgba(255, 218, 168, 1);
        color: rgba(19, 38, 52, 1);
    `}

    .depth-indicator {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        background: rgb(46, 63, 77);
        color: white;
        min-width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

export const CodeContainer = styled.pre`
  background-color: rgba(19, 38, 52, 1);
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
  min-height: 0;
  flex-grow: 1;
  color: white;
  display: flex;
  white-space: pre-wrap;
  word-wrap: break-word;

  & .hljs-string {
    color: #a5ff90;
  }

  & .hljs-literal,
  & .hljs-number {
    color: #f53b6e;
  }

  & .hljs-attr,
  & .hljs-bullet {
    color: #99ffff;
  }
`
