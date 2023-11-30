import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Typography } from '@equinor/eds-core-react'

export const ErrorGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(213, 18, 18, 0.71);
  border-radius: 5px;
  padding: 20px 20px;
  background-color: #f6dfdf;
  overflow: auto;
`

const Message = styled.div`
  overflow-wrap: break-word;
  font-family: monospace;
`

export class ErrorBoundary extends React.Component<
	any,
	{ hasError: boolean; error: Error }
> {
	message = 'unknown'

	constructor(props: { message: string }) {
		super(props)
		this.message = props.message
		this.state = { hasError: false, error: new Error('None') }
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return {
			hasError: true,
			error: error,
		}
	}

	fallBack: (error: Error) => ReactNode = (error: Error) => (
		<ErrorGroup>
			<Typography variant='h5' color='red'>
				{this.message}
			</Typography>
			<Message>{error.message}</Message>
		</ErrorGroup>
	)

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.fallBack(this.state.error)
		}
		return this.props.children
	}
}
