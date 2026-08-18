import type { Book, Status } from '../types'
import './BookList.css'

const STATUSES: Status[] = ['to-read', 'reading', 'finished']

export function BookList({
  books,
  onStatusChange,
  onPagesReadChange,
}: {
  books: Book[]
  onStatusChange: (id: string, status: Status) => void
  onPagesReadChange: (id: string, pagesRead: number) => void
}) {
  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-row">
          <span className="book-title">{book.title}</span>
          <span className="book-author">{book.author}</span>
          <select
            className="book-status"
            value={book.status}
            onChange={(e) => onStatusChange(book.id, e.target.value as Status)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            className="book-pages-input"
            type="number"
            min={0}
            max={book.totalPages}
            value={book.pagesRead}
            onChange={(e) => onPagesReadChange(book.id, Number(e.target.value))}
          />
          <span className="book-pages-total">{book.pagesRead} / {book.totalPages}</span>
        </li>
      ))}
    </ul>
  )
}
