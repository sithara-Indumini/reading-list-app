import { act, renderHook } from '@testing-library/react'
import { useBooks } from './useBooks'
import { mockBooks } from '../data/mockBooks'
import type { Book } from '../types'

const STORAGE_KEY = 'reading-list-books'

beforeEach(() => {
  localStorage.clear()
})

test('seeds mock data when localStorage is empty', () => {
  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(mockBooks)
})

test('loads existing books from localStorage instead of seeding', () => {
  const stored: Book[] = [
    { id: '99', title: 'Stored Book', author: 'Someone', totalPages: 100, pagesRead: 10, status: 'reading' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(stored)
})

test('falls back to seed data when localStorage contains malformed JSON', () => {
  localStorage.setItem(STORAGE_KEY, '{not valid json')

  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(mockBooks)
})

test('falls back to seed data when localStorage contains valid JSON of the wrong shape', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ oops: 'not a book array' }))

  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(mockBooks)
})

test('falls back to seed data when a stored book has an invalid status', () => {
  const stored = [
    { id: '99', title: 'Stored Book', author: 'Someone', totalPages: 100, pagesRead: 10, status: 'banana' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(mockBooks)
})

test('falls back to seed data when a stored book has pagesRead above totalPages', () => {
  const stored = [
    { id: '99', title: 'Stored Book', author: 'Someone', totalPages: 100, pagesRead: 9999, status: 'reading' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(mockBooks)
})

test('falls back to seed data when a stored book has a non-integer pagesRead', () => {
  const stored = [
    { id: '99', title: 'Stored Book', author: 'Someone', totalPages: 100, pagesRead: 10.5, status: 'reading' },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

  const { result } = renderHook(() => useBooks())

  expect(result.current.books).toEqual(mockBooks)
})

test('updateStatus changes the status of the matching book', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updateStatus('2', 'reading')
  })

  const updated = result.current.books.find((book) => book.id === '2')
  expect(updated?.status).toBe('reading')
})

test('updateStatus snaps pagesRead to totalPages when status becomes finished', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updateStatus('1', 'finished')
  })

  const updated = result.current.books.find((book) => book.id === '1')
  expect(updated?.status).toBe('finished')
  expect(updated?.pagesRead).toBe(updated?.totalPages)
})

test('updateStatus does not alter pagesRead for non-finished statuses', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updateStatus('1', 'to-read')
  })

  const updated = result.current.books.find((book) => book.id === '1')
  expect(updated?.status).toBe('to-read')
  expect(updated?.pagesRead).toBe(100)
})

test('updateStatus persists the change to localStorage immediately', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updateStatus('2', 'finished')
  })

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Book[]
  const updated = stored.find((book) => book.id === '2')
  expect(updated?.status).toBe('finished')
  expect(updated?.pagesRead).toBe(updated?.totalPages)
})

test('updateStatus is a no-op when the book id does not exist', () => {
  const { result } = renderHook(() => useBooks())
  const before = result.current.books

  act(() => {
    result.current.updateStatus('does-not-exist', 'finished')
  })

  expect(result.current.books).toEqual(before)
})

test('updatePagesRead sets pagesRead on the matching book', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updatePagesRead('1', 150)
  })

  const updated = result.current.books.find((book) => book.id === '1')
  expect(updated?.pagesRead).toBe(150)
})

test('updatePagesRead clamps to totalPages when the value is above it', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updatePagesRead('1', 9999)
  })

  const updated = result.current.books.find((book) => book.id === '1')
  expect(updated?.pagesRead).toBe(updated?.totalPages)
})

test('updatePagesRead clamps to 0 when the value is below it', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updatePagesRead('1', -5)
  })

  const updated = result.current.books.find((book) => book.id === '1')
  expect(updated?.pagesRead).toBe(0)
})

test('updatePagesRead persists the change to localStorage immediately', () => {
  const { result } = renderHook(() => useBooks())

  act(() => {
    result.current.updatePagesRead('2', 42)
  })

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Book[]
  const updated = stored.find((book) => book.id === '2')
  expect(updated?.pagesRead).toBe(42)
})

test('updatePagesRead is a no-op when the book id does not exist', () => {
  const { result } = renderHook(() => useBooks())
  const before = result.current.books

  act(() => {
    result.current.updatePagesRead('does-not-exist', 10)
  })

  expect(result.current.books).toEqual(before)
})
