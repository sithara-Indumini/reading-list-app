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
    <ul className="book-list" data-testid="book-list">
      {books.map((book) => (
        <li key={book.id} className="book-row" data-testid={`book-row-${book.id}`}>
          <span className="book-title" data-testid="book-title">{book.title}</span>
          <span className="book-author" data-testid="book-author">{book.author}</span>
          <select
            className="book-status"
            data-testid="book-status"
            aria-label={`Status for ${book.title}`}
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
            data-testid="book-pages-input"
            aria-label={`Pages read for ${book.title}`}
            type="number"
            min={0}
            max={book.totalPages}
            value={book.pagesRead}
            onChange={(e) => onPagesReadChange(book.id, Number(e.target.value))}
          />
          <span className="book-pages-total" data-testid="book-pages-total">{book.pagesRead} / {book.totalPages}</span>
        </li>
      ))}
    </ul>
  )
}
