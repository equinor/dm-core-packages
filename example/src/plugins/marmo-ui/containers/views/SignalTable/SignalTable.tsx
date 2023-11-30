import React, { useState } from 'react'
import {
	Button,
	Icon,
	NativeSelect,
	Table,
	Typography,
} from '@equinor/eds-core-react'
import { chevron_left, chevron_right } from '@equinor/eds-icons'

import {
	IUIPlugin,
	Loading,
	TGenericObject,
	useDocument,
} from '@development-framework/dm-core'
import { PaginationWrapper, SectionWrapper } from './styles'

interface Column {
	id: 'index' | 'value'
	label: string
	minWidth?: number
	format?: (value: number) => string
}

const SignalTable = (props: { document: TGenericObject }) => {
	const { document } = props
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)

	const xLabel = `${document.xlabel || document.xname}${
		document.xunit ? ` [${document.xunit}]` : ''
	}`
	const yLabel = `${document.label || document.name}${
		document.unit ? ` [${document.unit}]` : ''
	}`

	const columns: readonly Column[] = [
		{
			id: 'index',
			label: xLabel,
			minWidth: 30,
			format: (value: number) => value.toLocaleString('en-US'),
		},
		{
			id: 'value',
			label: yLabel,
			minWidth: 100,
			format: (value: number) => value.toLocaleString('en-US'),
		},
	]

	const rows = document.value?.map((value: any, index: number) => ({
		index: index * document.xdelta + document.xstart,
		value,
	}))

	const getLabelDisplayedRowsTo = () => {
		if (count === -1) {
			return (page + 1) * rowsPerPage
		}
		return rowsPerPage === -1 ? count : Math.min(count, (page + 1) * rowsPerPage)
	}

	const count = rows?.length || 0
	const calculatedPages = count / rowsPerPage
	const availablePages = calculatedPages < 1 ? 1 : calculatedPages
	const visibleFromLabel = count === 0 ? 0 : page * rowsPerPage + 1
	const visibleToLabel = getLabelDisplayedRowsTo()

	return (
		<div>
			<Table style={{ width: '100%' }}>
				<Table.Head sticky>
					<Table.Row>
						{columns.map((column) => (
							<Table.Cell key={column.id} style={{ minWidth: column.minWidth }}>
								{column.label}
							</Table.Cell>
						))}
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{rows
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row: any) => (
							<Table.Row role='checkbox' tabIndex={-1} key={row.index}>
								{columns.map((column) => {
									const value = row[column.id]
									return (
										<Table.Cell key={column.id} style={{ fontSize: 12 }}>
											{column.format && typeof value === 'number'
												? column.format(value)
												: value}
										</Table.Cell>
									)
								})}
							</Table.Row>
						))}
				</Table.Body>
			</Table>
			<PaginationWrapper>
				<SectionWrapper>
					<Typography variant='label' group='input'>
						Rows per page:{' '}
					</Typography>
					<NativeSelect
						id='rowsPerPage'
						label=''
						value={rowsPerPage}
						onChange={(event) => setRowsPerPage(Number(event.target.value))}
						style={{ width: '70px' }}
					>
						{[5, 10, 25, 50, 100, 500].map((amount) => (
							<option key={amount}>{amount}</option>
						))}
					</NativeSelect>
				</SectionWrapper>
				<SectionWrapper>
					<Typography variant='meta'>
						{visibleFromLabel} - {visibleToLabel} of {count}
					</Typography>
				</SectionWrapper>
				<SectionWrapper>
					<Button
						disabled={page === 0}
						variant='ghost_icon'
						onClick={() => setPage((prevPage) => prevPage - 1)}
					>
						<Icon data={chevron_left} />
					</Button>
					<Button
						disabled={page + 1 === availablePages}
						variant='ghost_icon'
						onClick={() => setPage((prevPage) => prevPage + 1)}
					>
						<Icon data={chevron_right} />
					</Button>
				</SectionWrapper>
			</PaginationWrapper>
		</div>
	)
}

/****************************************************************/
const SignalTable_Component = (props: IUIPlugin) => {
	const { idReference } = props
	const { document, isLoading, error } = useDocument<TGenericObject>(
		idReference,
		1
	)

	if (isLoading) return <Loading />
	if (error) {
		throw new Error(JSON.stringify(error))
	}

	return <SignalTable document={document || {}} />
}

export { SignalTable_Component as SignalTable }
