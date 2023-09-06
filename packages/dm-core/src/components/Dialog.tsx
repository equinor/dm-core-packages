import { Button, Dialog as EdsDialog } from '@equinor/eds-core-react'
import React from 'react'

export interface Props {
  /** Provides a url for avatars being used as a link. */
  closeScrim: () => void
  /** Whether the Dialog is open or not */
  isOpen: boolean
  /** Child components to display inside the Dialog */
  children?: any
  /** The title of the Dialog window */
  header: string
  /** The width of the Dialog window */
  width?: string
  /** The height of the Dialog window */
  height?: string
  /** Any buttons you'd like shown in the dialog footer */
  actions?: JSX.Element[]
}

/**
 * Component which renders a Dialogue in a pop-up
 *
 * @docs Components
 * @scope Dialog
 *
 * @usage
 * Code example:
 * ```
 * () => {
 *   const [isOpen, setIsOpen] = React.useState(0);
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(1)}>Show</button>
 *        <Dialog
 *          isOpen={isOpen}
 *          header={'The header'}
 *          closeScrim={() => setIsOpen(0)}>
 *            Some content
 *        </Dialog>
 *    </>
 *   )
 * }
 * ```
 *
 * @param {Props} props {@link Props}
 * @returns A React component
 */
export const Dialog = (props: Props) => {
  const { closeScrim, isOpen, children, header, width, height, actions } = props
  return (
    <EdsDialog
      // @ts-ignore
      isDismissable
      open={isOpen}
      onClose={closeScrim}
      style={{
        width: width ? width : '100%',
        height: height ? height : '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <EdsDialog.Header>
        <EdsDialog.Title>{header}</EdsDialog.Title>
      </EdsDialog.Header>
      <EdsDialog.CustomContent style={{ flexGrow: 2 }}>
        {children}
      </EdsDialog.CustomContent>
      <EdsDialog.Actions
        style={{ display: 'flex', gap: '1rem', alignSelf: 'auto' }}
      >
        {actions}
        <Button variant="ghost" onClick={closeScrim}>
          Cancel
        </Button>
      </EdsDialog.Actions>
    </EdsDialog>
  )
}
