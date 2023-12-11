import { expect, test } from '@playwright/test'

test('Dimensional scalar', async ({ page }) => {
  const navigate = async () => {
    await page.goto('http://localhost:3000/')
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'form' }).click()
    await page.getByRole('button', { name: 'dimensional_scalar' }).click()
    await page.getByRole('button', { name: 'waveForm' }).click()
  }

  await test.step('Open plugin', async () => {
    await navigate()
    await expect(page.getByText('Height over sea (config)')).toBeVisible()
    await expect(page.getByText('Minimum Hs')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
  })

  await test.step('Edit values', async () => {
    await page
      .getByTestId('significantWaveHeight')
      .getByRole('spinbutton')
      .fill('2500')
    await page
      .getByTestId('minimumWaveHeight')
      .getByRole('spinbutton')
      .fill('1.9')
    await page
      .getByTestId('maximumWaveHeight')
      .getByRole('spinbutton')
      .fill('10.1')
    await page.getByTestId('medianWaveHeight').getByRole('spinbutton').fill('5')
    await page.getByTestId('number').getByRole('spinbutton').fill('25')
    await page.getByRole('textbox').fill('1 mile')
    await page.getByRole('button', { name: 'Submit' }).click()
    await navigate()
    await expect(
      page.getByTestId('significantWaveHeight').getByRole('spinbutton')
    ).toHaveValue('2500')
    await expect(
      page.getByTestId('minimumWaveHeight').getByRole('spinbutton')
    ).toHaveValue('1.9')
    await expect(
      page.getByTestId('maximumWaveHeight').getByRole('spinbutton')
    ).toHaveValue('10.1')
    await expect(
      page.getByTestId('medianWaveHeight').getByRole('spinbutton')
    ).toHaveValue('5')
    await expect(
      page.getByTestId('number').getByRole('spinbutton')
    ).toHaveValue('25')
    await expect(page.getByRole('textbox')).toHaveValue('1 mile')
  })

  await test.step('Edit where config overrides', async () => {
    await page
      .getByRole('button', { name: 'file significantWaveHeight' })
      .click()
    await page.getByRole('button', { name: 'edit Edit' }).click()
    await page
      .getByLabel('label (optional)')
      .fill('Should not show as config overrides')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('button', { name: 'waveForm' }).click()
    await expect(
      page.getByTestId('significantWaveHeight').getByRole('paragraph')
    ).toContainText('Height over sea (config)')
    await expect(
      page.getByText('Should not show as config overrides')
    ).not.toBeVisible()
    await page.getByRole('button', { name: 'waveForm' }).click()
    await page
      .getByRole('button', { name: 'file significantWaveHeight' })
      .click()
    await page.getByRole('button', { name: 'edit Edit' }).click()
    await expect(page.getByLabel('label (optional)')).toHaveValue(
      'Should not show as config overrides'
    )
  })

  await test.step('Edit without any override', async () => {
    await page.getByRole('button', { name: 'file maximumWaveHeight' }).click()
    await page.getByRole('button', { name: 'edit Edit' }).click()
    await page.getByLabel('value').fill('88888')
    await page.getByLabel('label (optional)').fill('New Maximum')
    await page.getByLabel('unit (optional)').fill('€')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('button', { name: 'waveForm' }).click()
    await expect(
      page.getByTestId('maximumWaveHeight').getByRole('spinbutton')
    ).toHaveValue('88888')
    await expect(
      page.getByTestId('maximumWaveHeight').getByRole('paragraph')
    ).toContainText('New Maximum')
    await expect(
      page.getByTestId('maximumWaveHeight').locator('span')
    ).toContainText('€')
  })
})
