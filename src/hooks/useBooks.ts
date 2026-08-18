import { useState } from 'react'
import type { Book } from '../types'
import { mockBooks } from '../data/mockBooks'

const STORAGE_KEY = 'reading-list-books'

function loadOrSeed(): Book[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored) as Book[]
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBooks))
  return mockBooks
}

export function useBooks() {
  const [books] = useState<Book[]>(loadOrSeed)
  return { books }
}
