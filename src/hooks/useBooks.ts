import { useState } from 'react'
import type { Book } from '../types'
import { mockBooks } from '../data/mockBooks'

const STORAGE_KEY = 'reading-list-books'

function isBookArray(value: unknown): value is Book[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Book).id === 'string' &&
        typeof (item as Book).title === 'string' &&
        typeof (item as Book).author === 'string' &&
        typeof (item as Book).totalPages === 'number' &&
        typeof (item as Book).pagesRead === 'number' &&
        typeof (item as Book).status === 'string',
    )
  )
}

function seed(): Book[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBooks))
  return mockBooks
}

function loadOrSeed(): Book[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return seed()
  }

  try {
    const parsed = JSON.parse(stored)
    if (isBookArray(parsed)) {
      return parsed
    }
  } catch {
    // malformed JSON in storage — fall through to reseed below
  }

  return seed()
}

export function useBooks() {
  const [books] = useState<Book[]>(loadOrSeed)
  return { books }
}
