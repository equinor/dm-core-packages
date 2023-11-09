import { expect, test } from '@playwright/test'

test('Form default DMSS UI Recipe', async ({ page }) => {
  const navigate = async () => {
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'default_recipe' }).click()
    await page.getByRole('button', { name: 'file Form' }).click()
    await page.getByRole('tab', { name: 'Edit' }).click()
  }

  await test.step('Open simple form', async () => {
    await page.goto('http://localhost:3000/')
    await navigate()
  })

  await test.step('Remove prefilled optional string', async () => {
    await page.getByLabel('An optional string (optional)').fill('')
  })

  await test.step('Fill out required string', async () => {
    await page.getByLabel('Required string').fill('')
    await page.getByTestId('form-submit').click()
    await expect(page.getByText('Required', { exact: true })).toBeVisible()
    await page.getByLabel('Required string').fill('Foo')
  })

  await test.step('Fill out number field', async () => {
    await page.getByLabel('Numbers only (optional)').fill('Text')
    await page.getByTestId('form-submit').click()
    await expect(page.getByText('Only numbers allowed')).toBeVisible()
    await page.getByLabel('Numbers only (optional)').fill('3.14')
  })

  await test.step('Fill out integer field', async () => {
    await page.getByLabel('Integer only (optional)').fill('3.14')
    await page.getByTestId('form-submit').click()
    await expect(page.getByText('Only integers allowed')).toBeVisible()
    await page.getByLabel('Integer only (optional)').fill('123')
  })

  await test.step('Check checkbox', async () => {
    await page.getByLabel('An optional checkbox (optional)').check()
    //await page.getByTestId('form-submit').click()
    // await expect(page.getByText('<Field is mandatory>')).toBeVisible() //Known bug (itemid:37251754)
    await page
      .getByLabel('A required checkbox (e.g. for confirmation purposes)')
      .check()
  })

  await test.step('Fill out date field', async () => {
    await page.getByLabel('date').fill('2023-01-01T13:00')
  })

  await test.step('Submitting form', async () => {
    await page.getByTestId('form-submit').click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  })

  await test.step('Reloading form, expecting entered values to be stored', async () => {
    await page.reload()
    await navigate()
    await expect(page.getByLabel('Optional string (optional)')).toHaveValue('')
    await expect(page.getByLabel('Required string')).toHaveValue('Foo')
    await expect(page.getByLabel('Numbers only (optional)')).toHaveValue('3.14')
    await expect(page.getByLabel('Integer only (optional)')).toHaveValue('123')
    await expect(
      page.getByLabel('An optional checkbox (optional)')
    ).toBeChecked()
    await expect(
      page.getByLabel('A required checkbox (e.g. for confirmation purposes)')
    ).toBeChecked()
    await expect(page.getByLabel('date')).toHaveValue('2023-01-01T13:00')
  })
})

test('TableList default DMSS UI Recipe', async ({ page }) => {
  const navigate = async () => {
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'default_recipe' }).click()
    await page.getByRole('button', { name: 'TableList' }).click()
    await page.getByRole('tab', { name: 'Edit' }).click()
  }

  await test.step('Open plugin', async () => {
    await page.goto('http://localhost:3000/')
    await navigate()
  })

  await test.step('Open existing item', async () => {
    await page
      .getByRole('group', { name: 'cars (optional)' })
      .getByLabel('Open in tab')
      .click()
    await page
      .getByRole('row', { name: 'Volvo' })
      .getByRole('button', { name: 'Open item', exact: true })
      .click()
    await expect(
      page.getByRole('button', { name: 'Copy as YAML' })
    ).toBeVisible()
    await page.getByRole('tab', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('name').getByRole('textbox')).toHaveValue(
      'Volvo'
    )
    await page
      .getByRole('row', { name: 'Volvo' })
      .getByRole('button', { name: 'Close item', exact: true })
      .click()
  })

  await test.step('Add new item', async () => {
    await page
      .getByRole('button', { name: 'Append Add Item', exact: true })
      .click()
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.getByTestId('expandListItem-1').click()
    await expect(
      page.getByRole('button', { name: 'Copy as YAML' })
    ).toBeVisible()
    await page.getByRole('tab', { name: 'Edit' }).last().click()
    await page.getByTestId('name').getByRole('textbox').fill('Audi')
    await page.getByTestId('model').getByRole('textbox').fill('e-tron')
    await page.getByTestId('color').getByRole('textbox').fill('blue')
    await page.getByRole('button', { name: 'Submit', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByLabel('Close cars').click()
  })

  await test.step('Remove and add optional list', async () => {
    await page
      .getByRole('group', { name: 'cars (optional)' })
      .getByLabel('Remove and save')
      .click()
    await expect(
      page
        .getByRole('group', { name: 'cars (optional)' })
        .getByLabel('Remove and save')
    ).not.toBeVisible()
    await page
      .getByRole('group', { name: 'cars (optional)' })
      .getByLabel('Add and save')
      .click()
    await page
      .getByRole('group', { name: 'cars (optional)' })
      .getByLabel('Open in tab')
      .click()
    await expect(page.getByText('0 - 0 of 0')).toBeVisible()
  })
})
