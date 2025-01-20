export type DataGridImportDialogProps = {
  attributeType: string
  data: any[]
  dimensions: string | undefined
  closeModal: () => void
  open: boolean
  setData: (data: any[]) => void
}
