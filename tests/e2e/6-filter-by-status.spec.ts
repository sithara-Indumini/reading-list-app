import { test, expect } from '@playwright/test'

test.describe('Story 2.1 — Filter my list by status (#6)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('filter control offers All, To Read, Reading, and Finished, in that order', async ({ page }) => {
    // Covers TC-07
    const filter = page.getByLabel('Filter by status')
    await expect(filter.locator('option')).toHaveText(['All', 'To Read', 'Reading', 'Finished'])
  })

  test('selecting "To Read" shows only to-read books', async ({ page }) => {
    // Covers TC-01
    await page.getByLabel('Filter by status').selectOption('to-read')

    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(2)
    await expect(page.getByTestId('book-row-2').getByTestId('book-title')).toHaveText('Foundation')
    await expect(page.getByTestId('book-row-4').getByTestId('book-title')).toHaveText('Neuromancer')
  })

  test('selecting "Reading" shows only reading books', async ({ page }) => {
    // Covers TC-02
    await page.getByLabel('Filter by status').selectOption('reading')

    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(2)
    await expect(page.getByTestId('book-row-1').getByTestId('book-title')).toHaveText('Dune')
    await expect(page.getByTestId('book-row-5').getByTestId('book-title')).toHaveText('Snow Crash')
  })

  test('selecting "Finished" shows only finished books', async ({ page }) => {
    // Covers TC-03
    await page.getByLabel('Filter by status').selectOption('finished')

    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(2)
    await expect(page.getByTestId('book-row-3').getByTestId('book-title')).toHaveText('The Hobbit')
    await expect(page.getByTestId('book-row-6').getByTestId('book-title')).toHaveText('The Left Hand of Darkness')
  })

  test('switching back to "All" restores every book', async ({ page }) => {
    // Covers TC-04
    const filter = page.getByLabel('Filter by status')
    await filter.selectOption('reading')
    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(2)

    await filter.selectOption('all')

    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(6)
  })

  test('filter selection resets to "All" after a reload, rather than persisting', async ({ page }) => {
    // Covers TC-05
    const filter = page.getByLabel('Filter by status')
    await filter.selectOption('finished')
    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(2)

    await page.reload()

    await expect(page.getByLabel('Filter by status')).toHaveValue('all')
    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(6)
  })
})
