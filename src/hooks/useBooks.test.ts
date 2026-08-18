import { renderHook } from '@testing-library/react'
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
