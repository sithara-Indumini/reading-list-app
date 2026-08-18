import { useState } from 'react'
import { BookList } from './components/BookList'
import { useBooks } from './hooks/useBooks'
import type { Status } from './types'
import './App.css'

type StatusFilter = Status | 'all'

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'to-read', label: 'To Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
]

function App() {
  const { books, updateStatus, updatePagesRead } = useBooks()
  const [filter, setFilter] = useState<StatusFilter>('all')

  const filteredBooks = filter === 'all' ? books : books.filter((book) => book.status === filter)

  return (
    <main>
      <h1>My Reading List</h1>
      <label className="filter-bar">
        Filter by status
        <select value={filter} onChange={(e) => setFilter(e.target.value as StatusFilter)}>
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <BookList books={filteredBooks} onStatusChange={updateStatus} onPagesReadChange={updatePagesRead} />
    </main>
  )
}

export default App
