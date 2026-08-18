import { render, screen } from '@testing-library/react'
import { BookList } from './BookList'
import type { Book } from '../types'

const books: Book[] = [
  { id: '1', title: 'Dune', author: 'Frank Herbert', totalPages: 412, pagesRead: 100, status: 'reading' },
  { id: '2', title: 'Foundation', author: 'Isaac Asimov', totalPages: 255, pagesRead: 0, status: 'to-read' },
]

test('renders every book with title, author, status, and pages read out of total', () => {
  render(<BookList books={books} />)

  expect(screen.getByText('Dune')).toBeInTheDocument()
  expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
  expect(screen.getByText('reading')).toBeInTheDocument()
  expect(screen.getByText('100 / 412')).toBeInTheDocument()

  expect(screen.getByText('Foundation')).toBeInTheDocument()
  expect(screen.getByText('Isaac Asimov')).toBeInTheDocument()
  expect(screen.getByText('to-read')).toBeInTheDocument()
  expect(screen.getByText('0 / 255')).toBeInTheDocument()
})
