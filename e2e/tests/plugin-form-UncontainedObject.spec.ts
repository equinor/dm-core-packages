import { expect, test } from '@playwright/test'

test('uncontainedObject', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('uncontained_object', { exact: true }).click()
  await page.getByText('UncontainedObject').click()

  const dialog = page.getByRole('dialog')

  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await expect(page.getByRole('code').getByText('Miranda')).toBeVisible()
  await expect(page.getByRole('code').getByText('1337')).toBeVisible()
  await page.getByRole('button', { name: 'Close ceo' }).click()

  await expect(
    page.getByTestId('accountant').getByRole('code').getByText('Miranda')
  ).toBeVisible()
  await expect(page.getByRole('code').getByText('1337')).toBeVisible()

  // Add assistant
  await page
    .getByTestId('assistant')
    .getByRole('button', { name: 'Add and save' })
    .click()
  await expect(dialog).toBeVisible()
  await dialog.getByText('plugins', { exact: true }).click()
  await dialog.getByText('form', { exact: true }).click()
  await dialog.getByText('uncontained_object', { exact: true }).click()
  await dialog.getByText('UncontainedObject').click()
  await dialog.getByText('employees').click()
  await dialog.getByText('John').click()
  await dialog.getByRole('button', { name: 'Select', exact: true }).click()
  await expect(dialog).not.toBeVisible()

  await page
    .getByTestId('assistant')
    .getByRole('button', { name: 'Open' })
    .click()
  await expect(page.getByText('John')).toBeVisible()
  await expect(page.getByText('1234')).toBeVisible()
  await page.getByRole('button', { name: 'Close assistant' }).click()

  // Add trainee
  await page
    .getByTestId('trainee')
    .getByRole('button', { name: 'Add and save' })
    .click()
  await expect(dialog).toBeVisible()
  await dialog.getByText('plugins', { exact: true }).click()
  await dialog.getByText('form', { exact: true }).click()
  await dialog.getByText('uncontained_object', { exact: true }).click()
  await dialog.getByText('UncontainedObject').click()
  await dialog.getByText('employees').click()
  await dialog.getByText('John').first().click()
  await dialog.getByRole('button', { name: 'Select', exact: true }).click()

  await expect(dialog).not.toBeVisible()
  await expect(
    page.getByTestId('trainee').getByRole('code').getByText('John')
  ).toBeVisible()
  await expect(
    page.getByTestId('trainee').getByRole('code').getByText('1234')
  ).toBeVisible()

  // Change accountant
  await page
    .getByTestId('accountant')
    .getByRole('button', { name: 'Edit and save' })
    .click()
  await expect(dialog).toBeVisible()
  await dialog.getByText('plugins', { exact: true }).click()
  await dialog.getByText('form', { exact: true }).click()
  await dialog.getByText('uncontained_object', { exact: true }).click()
  await dialog.getByText('UncontainedObject').click()
  await dialog.getByText('employees', { exact: true }).click()
  await dialog.getByText('John').first().click()
  await dialog.getByRole('button', { name: 'Select', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(
    page.getByTestId('accountant').getByRole('code').getByText('John')
  ).toBeVisible()
  await expect(
    page.getByTestId('accountant').getByRole('code').getByText('1234')
  ).toBeVisible()

  //Remove trainee
  const trainee = page.getByTestId('trainee')
  await trainee.getByRole('button', { name: 'Remove and save' }).click()
  await expect(trainee.getByRole('code').getByText('John')).not.toBeVisible()
  await expect(trainee.getByRole('code').getByText('1234')).not.toBeVisible()

  // Submit form
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert').last()).toHaveText(['Document updated'])
})
