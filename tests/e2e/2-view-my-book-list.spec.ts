import { test, expect } from '@playwright/test'
import { mockBooks } from '../../src/data/mockBooks'

// Must match STORAGE_KEY in src/hooks/useBooks.ts
const STORAGE_KEY = 'reading-list-books'

test.describe('Story 1.1 — View my book list (#2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('renders every seeded book with title, author, status, and pages progress', async ({ page }) => {
    // Covers TC-01
    for (const book of mockBooks) {
      const row = page.getByTestId(`book-row-${book.id}`)
      await expect(row.getByTestId('book-title')).toHaveText(book.title)
      await expect(row.getByTestId('book-author')).toHaveText(book.author)
      await expect(row.getByTestId('book-status')).toHaveValue(book.status)
      await expect(row.getByTestId('book-pages-total')).toHaveText(`${book.pagesRead} / ${book.totalPages}`)
    }
  })

  test('loads persisted data from localStorage on reload, instead of re-seeding', async ({ page }) => {
    // Covers TC-02
    const row = page.getByTestId('book-row-2')
    await row.getByTestId('book-status').selectOption('reading')

    await page.reload()

    await expect(page.getByTestId('book-row-2').getByTestId('book-status')).toHaveValue('reading')
  })

  test('shows pagesRead / totalPages for books at zero, partial, and full progress', async ({ page }) => {
    // Covers TC-03
    await expect(page.getByTestId('book-row-2').getByTestId('book-pages-total')).toHaveText('0 / 255')
    await expect(page.getByTestId('book-row-1').getByTestId('book-pages-total')).toHaveText('100 / 412')
    await expect(page.getByTestId('book-row-3').getByTestId('book-pages-total')).toHaveText('310 / 310')
  })

  test('recovers by re-seeding when localStorage contains malformed JSON', async ({ page }) => {
    // Covers TC-04
    await page.evaluate((key) => localStorage.setItem(key, 'not valid json'), STORAGE_KEY)

    await page.reload()

    await expect(page.getByTestId('book-row-1').getByTestId('book-title')).toHaveText('Dune')
  })

  test('renders an empty list, without re-seeding, when localStorage holds an empty array', async ({ page }) => {
    // Covers TC-05
    await page.evaluate((key) => localStorage.setItem(key, JSON.stringify([])), STORAGE_KEY)

    await page.reload()

    await expect(page.getByTestId('book-list').locator('li')).toHaveCount(0)
  })

  test('does not crash when a stored book record is missing a required field', async ({ page }) => {
    // Covers TC-06
    // Note: the app validates the localStorage array as a whole, not per-record, so a
    // malformed record currently causes a full re-seed rather than a partial degrade.
    // That's still "does not crash," which is what this case checks.
    await page.evaluate((key) => {
      const malformed = [{ id: '99', title: 'Broken Book', author: 'Nobody', status: 'to-read', pagesRead: 0 }]
      localStorage.setItem(key, JSON.stringify(malformed))
    }, STORAGE_KEY)

    await page.reload()

    await expect(page.getByTestId('book-row-1').getByTestId('book-title')).toHaveText('Dune')
  })

  test('displays the correct status value for to-read, reading, and finished books', async ({ page }) => {
    // Covers TC-07
    await expect(page.getByTestId('book-row-2').getByTestId('book-status')).toHaveValue('to-read')
    await expect(page.getByTestId('book-row-1').getByTestId('book-status')).toHaveValue('reading')
    await expect(page.getByTestId('book-row-3').getByTestId('book-status')).toHaveValue('finished')
  })

  test('seeds mock data once when localStorage is absent, then persists it for later loads', async ({ page }) => {
    // Covers TC-08
    const seeded = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    expect(seeded).not.toBeNull()
    expect(JSON.parse(seeded ?? '[]')).toHaveLength(mockBooks.length)

    await page.reload()

    const afterReload = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    expect(afterReload).toBe(seeded)
  })

  test('preserves a pages-read change across a page reload', async ({ page }) => {
    // Covers TC-09
    const row = page.getByTestId('book-row-4')
    await row.getByTestId('book-pages-input').fill('50')

    await page.reload()

    await expect(page.getByTestId('book-row-4').getByTestId('book-pages-input')).toHaveValue('50')
  })
})
