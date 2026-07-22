import {
  type IUIPlugin,
  Loading,
  splitAddress,
  useApplication,
  useDocument,
} from '@development-framework/dm-core'
import axios from 'axios'
import hljs from 'highlight.js'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MediaObject } from '../mediaViewer/MediaViewerPlugin.types'
import { StyledMarkdownWrapper } from './MarkdownPlugin.styles'
import 'highlight.js/styles/github-dark.css'
import { Icon } from '@equinor/eds-core-react'
import { checkbox, checkbox_outline } from '@equinor/eds-icons'

const markdownComponents = {
  input(props: any) {
    if (props.type === 'checkbox') {
      return (
        <Icon
          role='checkbox'
          aria-checked={props.checked}
          aria-disabled
          data={props.checked ? checkbox : checkbox_outline}
          {...props}
        />
      )
    }
    return <input {...props} />
  },
  code({ node, inline, className, children, ...props }: any) {
    const definedLanguage = /language-(\w+)/.exec(className || '')
    return !inline && definedLanguage ? (
      <pre
        language={definedLanguage[1]}
        {...props}
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(String(children).replace(/\n$/, ''), {
            language: definedLanguage[1],
          }).value,
        }}
      ></pre>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

const MarkdownView = ({ markdownString }: { markdownString?: string }) => (
  <StyledMarkdownWrapper className='dm-plugin-padding'>
    <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {markdownString}
    </Markdown>
  </StyledMarkdownWrapper>
)

const InlineMarkdown = ({ content }: { content: string }) => (
  <MarkdownView markdownString={content} />
)

const FileMarkdown = ({ idReference }: { idReference: string }) => {
  const { dmssAPI } = useApplication()
  const [markdownString, setMarkdownString] = useState<string>()
  const [fetchError, setFetchError] = useState<Error>()
  const { document, isLoading, error } = useDocument<MediaObject>(
    idReference,
    1,
    false
  )

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (document) {
        const { dataSource } = splitAddress(idReference)
        const response = await dmssAPI.blobGetById(
          {
            dataSourceId: dataSource,
            blobId: document?.content?.address.slice(1),
          },
          { responseType: 'blob' }
        )
        const blobFile = new Blob([response.data], {
          type: 'text/markdown',
        })
        const syntheticBlobUrl = window.URL.createObjectURL(blobFile)
        try {
          const file = await axios.get(syntheticBlobUrl)
          setMarkdownString(file.data)
        } finally {
          window.URL.revokeObjectURL(syntheticBlobUrl)
        }
      }
    }
    void fetchMarkdown().catch((err) =>
      setFetchError(
        err instanceof Error
          ? err
          : new Error(err?.toString() ?? 'Unknown error')
      )
    )
  }, [document, idReference, dmssAPI])

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (fetchError) throw fetchError
  if (isLoading || document === null) return <Loading />
  return <MarkdownView markdownString={markdownString} />
}

export const MarkdownPlugin = (props: IUIPlugin) => {
  const inlineContent: string | undefined = (props.config as any)?.content
  if (inlineContent !== undefined)
    return <InlineMarkdown content={inlineContent} />
  return <FileMarkdown idReference={props.idReference} />
}
