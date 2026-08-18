import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

beforeEach(() => {
  localStorage.clear()
})

test('renders every book by default (All)', () => {
  render(<App />)

  expect(screen.getByText('Dune')).toBeInTheDocument()
  expect(screen.getByText('Foundation')).toBeInTheDocument()
  expect(screen.getByText('The Hobbit')).toBeInTheDocument()
  expect(screen.getByText('Neuromancer')).toBeInTheDocument()
  expect(screen.getByText('Snow Crash')).toBeInTheDocument()
  expect(screen.getByText('The Left Hand of Darkness')).toBeInTheDocument()
})

test('filter control offers All / To Read / Reading / Finished', () => {
  render(<App />)

  const filter = screen.getByRole('combobox', { name: /filter/i })
  const optionLabels = Array.from(filter.querySelectorAll('option')).map((o) => o.textContent)
  expect(optionLabels).toEqual(['All', 'To Read', 'Reading', 'Finished'])
})

test('selecting "Reading" shows only books with that status', () => {
  render(<App />)

  const filter = screen.getByRole('combobox', { name: /filter/i })
  fireEvent.change(filter, { target: { value: 'reading' } })

  expect(screen.getByText('Dune')).toBeInTheDocument()
  expect(screen.getByText('Snow Crash')).toBeInTheDocument()
  expect(screen.queryByText('Foundation')).not.toBeInTheDocument()
  expect(screen.queryByText('The Hobbit')).not.toBeInTheDocument()
  expect(screen.queryByText('Neuromancer')).not.toBeInTheDocument()
  expect(screen.queryByText('The Left Hand of Darkness')).not.toBeInTheDocument()
})

test('selecting "All" after filtering shows every book again', () => {
  render(<App />)

  const filter = screen.getByRole('combobox', { name: /filter/i })
  fireEvent.change(filter, { target: { value: 'finished' } })
  fireEvent.change(filter, { target: { value: 'all' } })

  expect(screen.getByText('Dune')).toBeInTheDocument()
  expect(screen.getByText('Foundation')).toBeInTheDocument()
  expect(screen.getByText('The Hobbit')).toBeInTheDocument()
  expect(screen.getByText('Neuromancer')).toBeInTheDocument()
  expect(screen.getByText('Snow Crash')).toBeInTheDocument()
  expect(screen.getByText('The Left Hand of Darkness')).toBeInTheDocument()
})
