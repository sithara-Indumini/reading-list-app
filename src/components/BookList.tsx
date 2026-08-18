import type { Book, Status } from '../types'

const STATUSES: Status[] = ['to-read', 'reading', 'finished']

export function BookList({
  books,
  onStatusChange,
}: {
  books: Book[]
  onStatusChange: (id: string, status: Status) => void
}) {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <span>{book.title}</span>
          <span>{book.author}</span>
          <select
            value={book.status}
            onChange={(e) => onStatusChange(book.id, e.target.value as Status)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <span>{book.pagesRead} / {book.totalPages}</span>
        </li>
      ))}
    </ul>
  )
}
