import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { BookList } from './BookList'
import type { Book } from '../types'

const books: Book[] = [
  { id: '1', title: 'Dune', author: 'Frank Herbert', totalPages: 412, pagesRead: 100, status: 'reading' },
  { id: '2', title: 'Foundation', author: 'Isaac Asimov', totalPages: 255, pagesRead: 0, status: 'to-read' },
]

const noop = () => {}

test('renders every book with title, author, status, and pages read out of total', () => {
  render(<BookList books={books} onStatusChange={noop} onPagesReadChange={noop} />)

  expect(screen.getByText('Dune')).toBeInTheDocument()
  expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
  expect(screen.getByText('100 / 412')).toBeInTheDocument()

  expect(screen.getByText('Foundation')).toBeInTheDocument()
  expect(screen.getByText('Isaac Asimov')).toBeInTheDocument()
  expect(screen.getByText('0 / 255')).toBeInTheDocument()
})

test('each book has a status control offering the three statuses', () => {
  render(<BookList books={books} onStatusChange={noop} onPagesReadChange={noop} />)

  const controls = screen.getAllByRole('combobox')
  expect(controls).toHaveLength(2)

  const optionLabels = Array.from(controls[0].querySelectorAll('option')).map((o) => o.textContent)
  expect(optionLabels).toEqual(['to-read', 'reading', 'finished'])
})

test('selecting a status calls onStatusChange with the book id and new status', () => {
  const onStatusChange = vi.fn()
  render(<BookList books={books} onStatusChange={onStatusChange} onPagesReadChange={noop} />)

  const controls = screen.getAllByRole('combobox')
  fireEvent.change(controls[1], { target: { value: 'finished' } })

  expect(onStatusChange).toHaveBeenCalledWith('2', 'finished')
})

test('each book has a numeric pages-read input with the correct min/max/value', () => {
  render(<BookList books={books} onStatusChange={noop} onPagesReadChange={noop} />)

  const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
  expect(inputs).toHaveLength(2)

  expect(inputs[0].value).toBe('100')
  expect(inputs[0].min).toBe('0')
  expect(inputs[0].max).toBe('412')
})

test('changing the pages-read input calls onPagesReadChange with the book id and new value', () => {
  const onPagesReadChange = vi.fn()
  render(<BookList books={books} onStatusChange={noop} onPagesReadChange={onPagesReadChange} />)

  const inputs = screen.getAllByRole('spinbutton')
  fireEvent.change(inputs[1], { target: { value: '120' } })

  expect(onPagesReadChange).toHaveBeenCalledWith('2', 120)
})
