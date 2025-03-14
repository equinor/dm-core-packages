import {
  ErrorGroup,
  Loading,
  type TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Icon, Popover, TextField, Tooltip } from '@equinor/eds-core-react'
import { close, copy, edit, filter_alt, save } from '@equinor/eds-icons'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import { type ChangeEvent, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import YAML from 'yaml'
import { Stack } from '../common'
import { ActionButton, ActionsWrapper, CodeContainer } from './styles'
import { type YamlPluginProps, defaultConfig } from './types'

export const YamlPlugin = (props: YamlPluginProps) => {
  const { idReference, config: userConfig } = props
  const config = { ...defaultConfig, ...userConfig }
  const [depth, setDepth] = useState(0)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [showAsJSON, setShowAsJSON] = useState<boolean>(
    config?.languages[0] === 'json'
  )
  const [isDepthPopoverOpen, setIsDepthPopoverOpen] = useState<boolean>(false)

  const textEditor = useRef<HTMLInputElement>(null)
  const depthPopoverTrigger = useRef<HTMLButtonElement>(null)

  const { document, isLoading, error, setError, updateDocument } =
    useDocument<TGenericObject>(idReference, depth, false)

  const asYAML = useMemo(() => YAML.stringify(document), [document])
  const asJSON = useMemo(() => JSON.stringify(document, null, 2), [document])

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(showAsJSON ? asJSON : asYAML)
      toast.success('Successfully copied to clipboard!')
    } catch (e) {
      toast.error('Could not copy to clipboard. ' + e)
    }
  }

  function updateDepth(event: ChangeEvent<HTMLInputElement>): void {
    const newDepth = Number(event.target.value)
    if (setDepth && newDepth >= 0 && newDepth <= 999) {
      setDepth(newDepth)
    }
  }

  const saveChanges = () => {
    try {
      const clean = DOMPurify.sanitize(textEditor.current?.innerText || '{}')
      const parsedJSON = showAsJSON ? JSON.parse(clean) : YAML.parse(clean)
      updateDocument(parsedJSON, true, false, true).then(() => {
        setIsEditMode(false)
      })
    } catch (e) {
      console.log(e)
      toast.error(`Invalid JSON - ${e.message}`, { autoClose: false })
    }
  }

  if (!document && isLoading) return <Loading />
  if (error && !error.message) throw new Error(JSON.stringify(error, null, 2))

  return (
    <div className='dm-plugin-padding'>
      <Stack fullWidth minHeight={0} grow={1} spacing={0.25}>
        {error && (
          <div>
            <ErrorGroup>{error.message}</ErrorGroup>
          </div>
        )}
        <Stack
          direction='row'
          grow={1}
          minHeight={0}
          scrollY
          position='relative'
          style={{ background: '#132634' }}
        >
          <Stack minHeight={0} grow={1} fullWidth>
            <CodeContainer
              ref={textEditor}
              contentEditable={isEditMode}
              suppressContentEditableWarning={true}
            >
              {isEditMode ? (
                <code>{showAsJSON ? asJSON : asYAML}</code>
              ) : (
                <code
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight(showAsJSON ? asJSON : asYAML, {
                      language: showAsJSON ? 'json' : 'yaml',
                    })?.value,
                  }}
                />
              )}
            </CodeContainer>
          </Stack>
          {isEditMode ? (
            <ActionsWrapper>
              <Tooltip title='Save'>
                <ActionButton $bg='green' onClick={saveChanges}>
                  <Icon data={save} />
                </ActionButton>
              </Tooltip>
              <Tooltip title='Cancel'>
                <ActionButton
                  onClick={() => {
                    setIsEditMode(false)
                    setError(null)
                  }}
                >
                  <Icon data={close} />
                </ActionButton>
              </Tooltip>
            </ActionsWrapper>
          ) : (
            <ActionsWrapper>
              <Tooltip title='Change depth'>
                <ActionButton
                  aria-controls='depth-popover'
                  aria-expanded={isDepthPopoverOpen}
                  aria-haspopup
                  $bg='yellow'
                  id='depth-popover-anchor'
                  onClick={() => setIsDepthPopoverOpen(!isDepthPopoverOpen)}
                  ref={depthPopoverTrigger}
                >
                  <Icon data={filter_alt} />
                  <span className='depth-indicator'>{depth}</span>
                </ActionButton>
              </Tooltip>
              <Popover
                anchorEl={depthPopoverTrigger.current}
                id='depth-popover'
                onClose={() => setIsDepthPopoverOpen(false)}
                open={isDepthPopoverOpen}
                placement='left'
                trapFocus
              >
                <Popover.Content>
                  <TextField
                    id='depth_input'
                    label='Set depth'
                    type='number'
                    value={depth}
                    onChange={updateDepth}
                  />
                </Popover.Content>
              </Popover>
              {config.editable && (
                <Tooltip title='Edit'>
                  <ActionButton $bg='green' onClick={() => setIsEditMode(true)}>
                    <Icon data={edit} />
                  </ActionButton>
                </Tooltip>
              )}
              {config.languages?.length > 1 && (
                <Tooltip title={`Switch to ${showAsJSON ? 'YAML' : 'JSON'}`}>
                  <ActionButton onClick={() => setShowAsJSON(!showAsJSON)}>
                    {showAsJSON ? 'YAML' : 'JSON'}
                  </ActionButton>
                </Tooltip>
              )}
              <Tooltip title='Copy'>
                <ActionButton
                  title={`Copy as ${showAsJSON ? 'JSON' : 'YAML'}`}
                  onClick={copyToClipboard}
                >
                  <Icon data={copy} />
                </ActionButton>
              </Tooltip>
            </ActionsWrapper>
          )}
        </Stack>
      </Stack>
    </div>
  )
}
