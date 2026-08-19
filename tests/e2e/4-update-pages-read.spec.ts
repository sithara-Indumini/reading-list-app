import { test, expect } from '@playwright/test'

// Must match STORAGE_KEY in src/hooks/useBooks.ts
const STORAGE_KEY = 'reading-list-books'

test.describe('Story 1.3 — Update pages read (#4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  // The required "normal case" Playwright test for this story — marking a book finished
  // snaps pagesRead to totalPages — already lives in tests/e2e/3-update-book-status.spec.ts,
  // since it's driven by the status control, not the pages-read input. Not duplicated here.

  test('numeric input accepts a value within range and updates the pages total', async ({ page }) => {
    // Covers TC-01
    const row = page.getByTestId('book-row-2')
    await row.getByTestId('book-pages-input').fill('120')

    await expect(row.getByTestId('book-pages-input')).toHaveValue('120')
    await expect(row.getByTestId('book-pages-total')).toHaveText('120 / 255')
  })

  test('setting pages read to exactly totalPages leaves status unchanged', async ({ page }) => {
    // Covers TC-02
    const row = page.getByTestId('book-row-1')
    await row.getByTestId('book-pages-input').fill('412')

    await expect(row.getByTestId('book-pages-input')).toHaveValue('412')
    await expect(row.getByTestId('book-pages-total')).toHaveText('412 / 412')
    await expect(row.getByTestId('book-status')).toHaveValue('reading')
  })

  test('setting pages read down to 0 is accepted', async ({ page }) => {
    // Covers TC-03
    const row = page.getByTestId('book-row-5')
    await row.getByTestId('book-pages-input').fill('0')

    await expect(row.getByTestId('book-pages-input')).toHaveValue('0')
    await expect(row.getByTestId('book-pages-total')).toHaveText('0 / 470')
  })

  test('entering pages above totalPages is clamped to totalPages', async ({ page }) => {
    // Covers TC-05 (business rule, section 2.2 — required Playwright edge case)
    const row = page.getByTestId('book-row-2')
    await row.getByTestId('book-pages-input').fill('999')

    await expect(row.getByTestId('book-pages-input')).toHaveValue('255')
    await expect(row.getByTestId('book-pages-total')).toHaveText('255 / 255')
  })

  test('entering a negative number is clamped to 0', async ({ page }) => {
    // Covers TC-06
    const row = page.getByTestId('book-row-1')
    await row.getByTestId('book-pages-input').fill('-50')

    await expect(row.getByTestId('book-pages-input')).toHaveValue('0')
    await expect(row.getByTestId('book-pages-total')).toHaveText('0 / 412')
  })

  test('clearing the input resolves to 0, not NaN', async ({ page }) => {
    // Covers TC-07
    const row = page.getByTestId('book-row-5')
    await row.getByTestId('book-pages-input').fill('')

    await expect(row.getByTestId('book-pages-input')).toHaveValue('0')
    await expect(row.getByTestId('book-pages-total')).toHaveText('0 / 470')
  })

  test('pages-read change persists to localStorage immediately, without a reload', async ({ page }) => {
    // Covers TC-10
    await page.getByTestId('book-row-4').getByTestId('book-pages-input').fill('150')

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    const book = JSON.parse(stored ?? '[]').find((b: { id: string }) => b.id === '4')
    expect(book.pagesRead).toBe(150)
  })

  test('updating pages read for one book does not affect other rows', async ({ page }) => {
    // Covers TC-12
    await page.getByTestId('book-row-1').getByTestId('book-pages-input').fill('200')

    const untouched = page.getByTestId('book-row-2')
    await expect(untouched.getByTestId('book-pages-input')).toHaveValue('0')
    await expect(untouched.getByTestId('book-pages-total')).toHaveText('0 / 255')
  })
})
