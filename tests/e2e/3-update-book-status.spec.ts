import { test, expect } from '@playwright/test'

// Must match STORAGE_KEY in src/hooks/useBooks.ts
const STORAGE_KEY = 'reading-list-books'

test.describe("Story 1.2 — Update a book's status (#3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('status control offers to-read, reading, and finished, reflecting the current value', async ({ page }) => {
    // Covers TC-01, TC-11
    const status = page.getByTestId('book-row-1').getByTestId('book-status')
    const values = await status.locator('option').allTextContents()
    expect(values).toEqual(['to-read', 'reading', 'finished'])
    await expect(status).toHaveValue('reading')
  })

  test('changing status away from finished leaves pagesRead untouched', async ({ page }) => {
    // Covers TC-02
    const row = page.getByTestId('book-row-2')
    await row.getByTestId('book-status').selectOption('reading')

    await expect(row.getByTestId('book-status')).toHaveValue('reading')
    await expect(row.getByTestId('book-pages-total')).toHaveText('0 / 255')
  })

  test('marking a book finished snaps pagesRead to totalPages', async ({ page }) => {
    // Covers TC-03, TC-12 (ADR decision 4 business rule — required Playwright normal case)
    const row = page.getByTestId('book-row-1')
    await row.getByTestId('book-status').selectOption('finished')

    await expect(row.getByTestId('book-status')).toHaveValue('finished')
    await expect(row.getByTestId('book-pages-input')).toHaveValue('412')
    await expect(row.getByTestId('book-pages-total')).toHaveText('412 / 412')
  })

  test('status change persists to localStorage immediately, without a reload', async ({ page }) => {
    // Covers TC-04
    await page.getByTestId('book-row-5').getByTestId('book-status').selectOption('finished')

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    const book = JSON.parse(stored ?? '[]').find((b: { id: string }) => b.id === '5')
    expect(book.status).toBe('finished')
    expect(book.pagesRead).toBe(470)
  })

  test('persisted status and pagesRead survive a page reload', async ({ page }) => {
    // Covers TC-05
    await page.getByTestId('book-row-1').getByTestId('book-status').selectOption('finished')

    await page.reload()

    const row = page.getByTestId('book-row-1')
    await expect(row.getByTestId('book-status')).toHaveValue('finished')
    await expect(row.getByTestId('book-pages-input')).toHaveValue('412')
  })

  test('reverting from finished to another status does not restore the prior pagesRead', async ({ page }) => {
    // Covers TC-06 (ADR decision 4 business rule — required Playwright edge case)
    const row = page.getByTestId('book-row-1')
    await row.getByTestId('book-status').selectOption('finished')
    await expect(row.getByTestId('book-pages-input')).toHaveValue('412')

    await row.getByTestId('book-status').selectOption('reading')

    await expect(row.getByTestId('book-status')).toHaveValue('reading')
    await expect(row.getByTestId('book-pages-input')).toHaveValue('412')
  })

  test('reselecting the already-active status is a no-op', async ({ page }) => {
    // Covers TC-07
    const row = page.getByTestId('book-row-3')
    await row.getByTestId('book-status').selectOption('finished')

    await expect(row.getByTestId('book-status')).toHaveValue('finished')
    await expect(row.getByTestId('book-pages-input')).toHaveValue('310')
  })

  test("changing one book's status does not affect other rows", async ({ page }) => {
    // Covers TC-08
    await page.getByTestId('book-row-2').getByTestId('book-status').selectOption('finished')

    const untouched = page.getByTestId('book-row-1')
    await expect(untouched.getByTestId('book-status')).toHaveValue('reading')
    await expect(untouched.getByTestId('book-pages-total')).toHaveText('100 / 412')
  })
})
