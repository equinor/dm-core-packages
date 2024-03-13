export function createSyntheticFileDownload(url: string, fileName: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener norefferer'
  document.body.appendChild(link)
  link.click()
  link.parentNode?.removeChild(link)
}
