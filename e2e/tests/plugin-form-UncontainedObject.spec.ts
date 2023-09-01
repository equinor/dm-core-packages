import { test, expect } from '@playwright/test'

test('uncontainedObject', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('uncontained_object', { exact: true }).click()
  await page.getByText('UncontainedObject').click()

  await expect(
    page.getByTestId('ceo').getByText('Address: ^.employees[0]')
  ).toBeVisible()
  await expect(
    page.getByTestId('accountant').getByText('Address: ^.employees[0]')
  ).toBeVisible()

  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await expect(page.getByRole('code').getByText('Miranda')).toBeVisible()
  await expect(page.getByRole('code').getByText('1337')).toBeVisible()
  await page.getByRole('button', { name: 'Close ceo' }).click()

  await expect(
    page.getByTestId('accountant').getByRole('code').getByText('Miranda')
  ).toBeVisible()
  await expect(page.getByRole('code').getByText('1337')).toBeVisible()

  // Legge til en optional assistant
  await page
    .getByTestId('assistant')
    .getByRole('button', { name: 'Select and save' })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByText('plugins', { exact: true }).click()
  await page.getByRole('dialog').getByText('form', { exact: true }).click()
  await page
    .getByRole('dialog')
    .getByText('uncontained_object', { exact: true })
    .click()
  await page.getByRole('dialog').getByText('UncontainedObject').click()
  await page.getByRole('dialog').getByText('employees').click()
  await page.getByRole('dialog').getByText('John').click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Select', exact: true })
    .click()
  await expect(page.getByRole('dialog')).not.toBeVisible()

  await page
    .getByTestId('assistant')
    .getByRole('button', { name: 'Open' })
    .click()
  await expect(page.getByText('John')).toBeVisible()
  await expect(page.getByText('1234')).toBeVisible()
  await page.getByRole('button', { name: 'Close assistant' }).click()

  // Legge til en optional accountant og sjekke inline innhold
  await page
    .getByTestId('trainee')
    .getByRole('button', { name: 'Select and save' })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByText('plugins', { exact: true }).click()
  await page.getByRole('dialog').getByText('form', { exact: true }).click()
  await page
    .getByRole('dialog')
    .getByText('uncontained_object', { exact: true })
    .click()
  await page.getByRole('dialog').getByText('UncontainedObject').click()
  await page.getByRole('dialog').getByText('employees').click()
  await page.getByRole('dialog').getByText('John').first().click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Select', exact: true })
    .click()

  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(
    page.getByTestId('trainee').getByRole('code').getByText('John')
  ).toBeVisible()
  await expect(
    page.getByTestId('trainee').getByRole('code').getByText('1234')
  ).toBeVisible()

  // Bytt ut enten CEO eller accountant
  await page
    .getByTestId('accountant')
    .getByRole('button', { name: 'Select and save' })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByText('plugins', { exact: true }).click()
  await page.getByRole('dialog').getByText('form', { exact: true }).click()
  await page
    .getByRole('dialog')
    .getByText('uncontained_object', { exact: true })
    .click()
  await page.getByRole('dialog').getByText('UncontainedObject').click()
  await page.getByRole('dialog').getByText('employees', { exact: true }).click()
  await page.getByRole('dialog').getByText('John').first().click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Select', exact: true })
    .click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(
    page.getByTestId('accountant').getByRole('code').getByText('John')
  ).toBeVisible()
  await expect(
    page.getByTestId('accountant').getByRole('code').getByText('1234')
  ).toBeVisible()

  //Fjerne trainee optional
  await page.getByTestId('remove-trainee').click()
  await expect(
    page.getByTestId('trainee').getByRole('code').getByText('John')
  ).not.toBeVisible()
  await expect(
    page.getByTestId('trainee').getByRole('code').getByText('1234')
  ).not.toBeVisible()

  // Submit skjema
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert').last()).toHaveText(['Document updated'])
})
