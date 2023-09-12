import { expect, test } from '@playwright/test'

test('Read only primitives', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('read_only_primitives').click()
  await page.getByText('ReadOnlyPrimitives').click()

  const checkNotEditable = async () => {
    await expect(
      page.getByTestId('stringRequired').getByTestId('form-textfield')
    ).not.toBeEditable()

    await expect(
      page.getByTestId('stringOptional').getByTestId('form-textfield')
    ).not.toBeEditable()

    await expect(
      page.getByTestId('numberRequired').getByTestId('form-textfield')
    ).not.toBeEditable()

    await expect(
      page.getByTestId('numberOptional').getByTestId('form-textfield')
    ).not.toBeEditable()

    await expect(
      page.getByTestId('integer').getByTestId('form-textfield')
    ).not.toBeEditable()

    await expect(
      page.getByTestId('checkboxOptional').getByTestId('form-checkbox')
    ).not.toBeEditable()

    await expect(
      page.getByTestId('checkboxRequired').getByTestId('form-checkbox')
    ).not.toBeEditable()
  }

  await checkNotEditable()

  await page.getByRole('button', { name: 'Edit' }).click()

  await expect(
    page.getByTestId('stringRequired').getByTestId('form-textfield')
  ).toBeEditable()
  await page
    .getByTestId('stringRequired')
    .getByTestId('form-textfield')
    .fill('Updated required string')

  await expect(
    page.getByTestId('stringOptional').getByTestId('form-textfield')
  ).toBeEditable()
  await page
    .getByTestId('stringOptional')
    .getByTestId('form-textfield')
    .fill('Updated optional string')

  await expect(
    page.getByTestId('numberRequired').getByTestId('form-textfield')
  ).toBeEditable()
  await page
    .getByTestId('numberRequired')
    .getByTestId('form-textfield')
    .fill('2.2')

  await expect(
    page.getByTestId('numberOptional').getByTestId('form-textfield')
  ).toBeEditable()
  await page.getByTestId('numberOptional').getByTestId('form-textfield').clear()

  await expect(
    page.getByTestId('integer').getByTestId('form-textfield')
  ).toBeEditable()
  await page.getByTestId('integer').getByTestId('form-textfield').fill('33')

  await expect(
    page.getByTestId('checkboxOptional').getByTestId('form-checkbox')
  ).toBeEditable()
  await page
    .getByTestId('checkboxOptional')
    .getByTestId('form-checkbox')
    .check()

  await expect(
    page.getByTestId('checkboxRequired').getByTestId('form-checkbox')
  ).toBeEditable()
  await page
    .getByTestId('checkboxRequired')
    .getByTestId('form-checkbox')
    .uncheck()

  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])

  await checkNotEditable()
})
