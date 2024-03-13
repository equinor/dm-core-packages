export function isViewableInBrowser(contentType: string | undefined) {
  if (!contentType) return false
  const applicationExceptions = [
    'application/pdf',
    'application/json',
    'application/xml',
    'application/javascript',
  ]
  const accepted = ['image', 'video', 'audio']
  const isAcceptedMainType = accepted.some((type) => contentType.includes(type))
  const isAcceptedApplicationType = applicationExceptions.some(
    (type) => contentType === type
  )
  return isAcceptedMainType || isAcceptedApplicationType
}
