import {
  type IUIPlugin,
  Loading,
  SaveAnchorBoundary,
  type TGenericObject,
  useDocument,
  usePluginSaveRegistration,
} from '@development-framework/dm-core'
import { useRef, useState } from 'react'
import { Form } from './components/Form'

export const FormPlugin = (props: IUIPlugin) => {
  const { document, isLoading, updateDocument, error } = useDocument<any>(
    props.idReference,
    0
  )
  const [isDirty, setIsDirty] = useState(false)
  const submitRef = useRef<() => Promise<void>>(async () => {})
  const isNested = !!props.onChange

  const { isCoordinated, hasAnchorAbove, saveAll, notifyChanged } =
    usePluginSaveRegistration({
      id: isNested
        ? `form:${props.idReference}:embedded`
        : `form:${props.idReference}`,
      idReference: props.idReference,
      isDirty: isNested ? false : isDirty,
      save: isNested ? undefined : () => submitRef.current(),
    })

  // react-hook-form is unable to rerender when the document is updated.
  // This means that the form will not benefit from react-query caching.
  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  if (!document) return <Loading />

  const handleOnSubmit = (formData: TGenericObject) => {
    return updateDocument(formData, true, true).then(async () => {
      if (isCoordinated && !hasAnchorAbove) await saveAll()
      notifyChanged()
      if (props.onSubmit) props.onSubmit(formData)
    })
  }

  const handleOnChange = (formData: TGenericObject) => {
    if (props.onChange) props.onChange(formData)
  }

  const form = (
    <Form
      onOpen={props.onOpen}
      idReference={props.idReference}
      type={document.type}
      config={props.config}
      formData={document}
      onSubmit={isNested ? undefined : handleOnSubmit}
      onChange={props?.onChange && handleOnChange}
      onCoordinatorSync={
        isNested
          ? undefined
          : ({ isDirty: dirty, submit }) => {
              setIsDirty(dirty)
              submitRef.current = submit
            }
      }
      showSubmitButton={!props?.onChange}
      hideSubmitButton={hasAnchorAbove}
    />
  )

  return isNested || hasAnchorAbove ? (
    form
  ) : (
    <SaveAnchorBoundary>{form}</SaveAnchorBoundary>
  )
}
