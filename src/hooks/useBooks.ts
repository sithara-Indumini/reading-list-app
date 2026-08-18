import { useState } from 'react'
import type { Book, Status } from '../types'
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

function persist(books: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>(loadOrSeed)

  function updateStatus(id: string, status: Status): void {
    setBooks((current) => {
      const updated = current.map((book) =>
        book.id === id
          ? { ...book, status, pagesRead: status === 'finished' ? book.totalPages : book.pagesRead }
          : book,
      )
      persist(updated)
      return updated
    })
  }

  function updatePagesRead(id: string, pagesRead: number): void {
    setBooks((current) => {
      const updated = current.map((book) =>
        book.id === id ? { ...book, pagesRead: Math.min(Math.max(pagesRead, 0), book.totalPages) } : book,
      )
      persist(updated)
      return updated
    })
  }

  return { books, updateStatus, updatePagesRead }
}
