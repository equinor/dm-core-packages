import { expect, test } from '@playwright/test'

test('uncontainedObject', async ({ page }) => {
	await page.goto('http://localhost:3000/')
	await page.getByRole('button', { name: 'DemoDataSource' }).click()
	await page.getByRole('button', { name: 'plugins' }).click()
	await page.getByRole('button', { name: 'form' }).click()
	await page.getByRole('button', { name: 'uncontained_object' }).click()
	await page.getByRole('button', { name: 'UncontainedObject' }).click()

	const dialog = page.getByRole('dialog')
	const selectJohn = async () => {
		await expect(dialog).toBeVisible()
		await dialog.getByRole('button', { name: 'DemoDataSource' }).click()
		await dialog.getByRole('button', { name: 'plugins' }).click()
		await dialog.getByRole('button', { name: 'form' }).click()
		await dialog.getByRole('button', { name: 'uncontained_object' }).click()
		await dialog.getByRole('button', { name: 'UncontainedObject' }).click()
		await dialog.getByRole('button', { name: 'employees' }).click()
		await dialog
			.getByRole('listitem')
			.filter({ hasText: 'employees' })
			.last() // Get innermost list
			.getByRole('button', { name: 'John' })
			.click()
		await expect(dialog.getByText('Selected: John')).toBeVisible()
		await dialog.getByRole('button', { name: 'Select', exact: true }).click()
		await expect(dialog).not.toBeVisible()
	}

	await test.step('Assert CEO and accountant', async () => {
		await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
		await expect(page.getByRole('code').getByText('Miranda')).toBeVisible()
		await expect(page.getByRole('code').getByText('1337')).toBeVisible()
		await page.getByRole('button', { name: 'Close ceo' }).click()

		await expect(
			page.getByTestId('accountant').getByRole('code').getByText('Miranda')
		).toBeVisible()
		await expect(page.getByRole('code').getByText('1337')).toBeVisible()
	})

	await test.step('Add assistant', async () => {
		await page
			.getByTestId('assistant')
			.getByRole('button', { name: 'Add and save' })
			.click()
		await selectJohn()
		await page
			.getByTestId('assistant')
			.getByRole('button', { name: 'Open' })
			.click()
		await expect(page.getByText('John')).toBeVisible()
		await expect(page.getByText('1234')).toBeVisible()
		await page.getByRole('button', { name: 'Close assistant' }).click()
	})

	await test.step('Add trainee', async () => {
		await page
			.getByTestId('trainee')
			.getByRole('button', { name: 'Add and save' })
			.click()
		await selectJohn()
		await expect(
			page.getByTestId('trainee').getByRole('code').getByText('John')
		).toBeVisible()
		await expect(
			page.getByTestId('trainee').getByRole('code').getByText('1234')
		).toBeVisible()
	})

	await test.step('Change accountant', async () => {
		await page
			.getByTestId('accountant')
			.getByRole('button', { name: 'Edit and save' })
			.click()
		await selectJohn()
		await expect(
			page.getByTestId('accountant').getByRole('code').getByText('John')
		).toBeVisible()
		await expect(
			page.getByTestId('accountant').getByRole('code').getByText('1234')
		).toBeVisible()
	})

	await test.step('Remove trainee', async () => {
		const trainee = page.getByTestId('trainee')
		await trainee.getByRole('button', { name: 'Remove and save' }).click()
		await expect(trainee.getByRole('code').getByText('John')).not.toBeVisible()
		await expect(trainee.getByRole('code').getByText('1234')).not.toBeVisible()
	})

	await test.step('Submit form', async () => {
		await page.getByRole('button', { name: 'Submit' }).click()
		await expect(page.getByRole('alert').last()).toHaveText(['Document updated'])
	})
})
