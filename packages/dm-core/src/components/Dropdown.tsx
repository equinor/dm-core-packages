import React, {
	Dispatch,
	ReactElement,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react'
import styled from 'styled-components'
import { Checkbox, Icon, InputWrapper } from '@equinor/eds-core-react'
import { arrow_drop_down, arrow_drop_up } from '@equinor/eds-icons'

const DropdownPanel = styled.div`
  position: absolute;
  z-index: 50;
  width: 100%;
  max-height: 30rem;
  overflow-y: auto;
  border: 1px solid lightgray;
  background-color: white;
  box-shadow: 3px 3px 3px lightgray;
  border-radius: 5px;
  margin-top: 0.2rem;
`

const DropdownButton = styled.button<{ $disabled: boolean }>`
  appearance: none;
  border: 0;

  border-bottom: ${(props) =>
			props.$disabled ? '1px solid transparent' : '1px solid #6f6f6f'};
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${(props) =>
			props.$disabled ? '#f7f7f7' : 'rgb(247, 247, 247)'};
  color: ${(props) => (props.$disabled ? '#b2b2b2' : 'current-color')};
  padding: 6px 8px;
  font-family: 'Equinor', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.025rem;
  line-height: 1.5em;
  outline: 1px solid transparent;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`

export const Dropdown = (props: {
	itemNominator?: string
	items: string[]
	selectedItems: string[]
	setSelectedItems: Dispatch<SetStateAction<string[]>>
	disabled: boolean
	label: string
}): ReactElement => {
	const {
		label,
		disabled,
		itemNominator,
		items,
		selectedItems,
		setSelectedItems,
	} = props
	const [open, setOpen] = useState<boolean>(false)
	const someRef = useRef<any | null>(null)

	// Handle click outside the dropdown
	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (someRef.current && !someRef.current.contains(event.target)) {
				open && setOpen(false)
			}
		}
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [someRef.current])

	function handleSelect(selectedItem: string): void {
		if (selectedItems.includes(selectedItem)) {
			setSelectedItems(selectedItems.filter((item) => item !== selectedItem))
		} else setSelectedItems([...selectedItems, selectedItem])
	}

	function buttonCaption(): string {
		const nominator = `${itemNominator ?? 'items'}${
			selectedItems.length > 1 ? 's' : ''
		}`
		return selectedItems.length > 0
			? `${selectedItems.length} ${nominator} selected`
			: `Select ${nominator}`
	}

	return (
		<div style={{ position: 'relative', width: '200px' }}>
			<InputWrapper disabled={disabled} labelProps={{ label: label }}>
				<DropdownButton
					disabled={disabled}
					$disabled={disabled}
					onClick={() => setOpen(!open)}
					aria-label={`Open '${itemNominator}' panel`}
				>
					{buttonCaption()}
					<Icon
						data={open ? arrow_drop_up : arrow_drop_down}
						style={{ color: disabled ? '#bebebe' : '#007079' }}
					/>
				</DropdownButton>
			</InputWrapper>
			{open && (
				<DropdownPanel ref={someRef}>
					{items && items.length > 0 && (
						<ul style={{ padding: 0, listStyleType: 'none' }}>
							{items.map((item: string, idx: number) => (
								<li
									key={idx}
									style={{ cursor: 'pointer' }}
									onClick={() => handleSelect(item)}
								>
									<Checkbox
										label={item}
										checked={selectedItems.includes(item)}
										onChange={() => {
											handleSelect(item)
										}}
									/>
								</li>
							))}
						</ul>
					)}
					{(items.length === 0 || !items) && (
						<p style={{ padding: '0 .5rem' }}>No available items</p>
					)}
				</DropdownPanel>
			)}
		</div>
	)
}
