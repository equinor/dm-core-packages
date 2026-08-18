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
  // A contained sub-object (rendered via onChange) shares its ancestor's
  // react-hook-form instance (see Form.tsx: showSubmitButton=false reuses
  // useFormContext()) - handleSubmit() there submits the WHOLE ancestor form, not
  // just this slice. Saving must stay entirely owned by that ancestor.
  const isNested = !!props.onChange

  // Registers this form with the nearest SaveCoordinator (no-op if there is none,
  // e.g. when the form is used standalone - existing behavior is unaffected).
  const { isCoordinated, hasAnchorAbove, saveAll, notifyChanged } =
    usePluginSaveRegistration({
      id: `form:${props.idReference}`,
      idReference: props.idReference,
      isDirty: isNested ? false : isDirty,
      save: isNested ? undefined : () => submitRef.current(),
    })

  // react-hook-form is unable to rerender when the document is updated.
  // This means that the form will not benefit from react-query caching.
  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  // useDocument's error state lags one render behind its query settling with a null
  // document (they're separate state updates) - avoid crashing on that transient gap.
  if (!document) return <Loading />

  const handleOnSubmit = (formData: TGenericObject) => {
    // Must return this promise - the coordinator's save() (via submitRef) awaits it to
    // know when the save has actually finished, not just when it was kicked off.
    return updateDocument(formData, true, true).then(async () => {
      // Only the true anchor owner flushes nested deferred plugins - if an ancestor
      // already owns coordination, its own saveAll() already reaches this form too,
      // so calling it again here would re-invoke siblings redundantly (or recurse).
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

  // Only claim the save anchor when this form owns its own submit lifecycle - when
  // driven externally via onChange, or when an ancestor already owns coordination
  // (hasAnchorAbove), something else up the chain owns it instead.
  return isNested || hasAnchorAbove ? (
    form
  ) : (
    <SaveAnchorBoundary>{form}</SaveAnchorBoundary>
  )
}
