import {
  ErrorGroup,
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Button, Input, Label, Switch } from '@equinor/eds-core-react'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import YAML from 'yaml'

const StyledPre = styled.pre`
  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
  white-space: -pre-wrap; /* Opera */
  white-space: -o-pre-wrap; /* Opera */
  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  word-wrap: break-word; /* IE 5.5+ */
  background-color: #e0e3e5;
  margin: 0;
  padding: 1rem;
  border-radius: 0.2rem;
  border-style: ridge;
  border-width: 0.2rem;
  border-color: #193549;
  width: 100%;
  overflow-y: auto;
`

const CodeContainer = styled.pre`
  background-color: #193549;
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
  overflow-y: auto;

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

const YamlView = (props: {
  document: TGenericObject
  updateDocument: (
    document: TGenericObject,
    notify: boolean,
    partialUpdate?: boolean | undefined
  ) => Promise<void>
  depth?: number
  _setDepth?: Dispatch<SetStateAction<number>>
}) => {
  const { document, depth, _setDepth, updateDocument } = props
  const asYAML: string = YAML.stringify(document)
  const asJSON: string = JSON.stringify(document)
  const highlighted = hljs.highlight(asYAML, { language: 'yaml' })
  const [isEditMode, setIsEditMode] = useState(false)
  const textInput = useRef<HTMLInputElement>(null)

  const onClick = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  function setDepth(event: ChangeEvent<HTMLInputElement>): void {
    const newDepth = Number(event.target.value)
    if (_setDepth && newDepth >= 0 && newDepth <= 999) {
      _setDepth(newDepth)
    }
  }

  const saveChanges = () => {
    try {
      const parsed = JSON.parse(textInput.current?.innerText || '{}')
      updateDocument(parsed, true)
    } catch (e) {
      console.log(e)
      toast.error(`Invalid JSON - ${e.message}`, { autoClose: false })
    }
  }

  return (
    <div className='dm-plugin-padding flex flex-col w-full'>
      <div className='flex justify-end items-center my-2 gap-1 w-fit'>
        <Button variant='ghost' onClick={() => onClick(asYAML)}>
          Copy as YAML
        </Button>
        <Button variant='ghost' onClick={() => onClick(asJSON)}>
          Copy as JSON
        </Button>
        <div style={{ width: '5rem' }}>
          <Label htmlFor='yaml-depth-input' label='Depth' />
          <Input
            id='yaml-depth-input'
            type='number'
            value={depth}
            onChange={setDepth}
            label='Depth'
          />
        </div>
        <Switch
          label='Edit'
          checked={isEditMode}
          onChange={() => setIsEditMode(!isEditMode)}
        />
      </div>
      {isEditMode ? (
        <>
          <div className='flex justify-end p-1'>
            <Button onClick={saveChanges}>Save</Button>
          </div>
          <StyledPre
            ref={textInput}
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
          >
            {JSON.stringify(document, null, 2)}
          </StyledPre>
          <div className='flex justify-end p-1'>
            <Button onClick={saveChanges}>Save</Button>
          </div>
        </>
      ) : (
        <CodeContainer>
          <code
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(highlighted.value),
            }}
          />
        </CodeContainer>
      )}
    </div>
  )
}

export const YamlPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const [depth, setDepth] = useState(0)
  const { document, isLoading, error, updateDocument } =
    useDocument<TGenericObject>(idReference, depth)
  if (isLoading) return <Loading />

  if (error && !error.message) throw new Error(JSON.stringify(error, null, 2))

  return (
    <>
      {error && (
        <div className='p-1'>
          <ErrorGroup>{error.message}</ErrorGroup>
        </div>
      )}
      <YamlView
        document={document || {}}
        _setDepth={setDepth}
        depth={depth}
        updateDocument={updateDocument}
      />
    </>
  )
}
