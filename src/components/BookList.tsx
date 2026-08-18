import type { Book } from '../types'

export function BookList({ books }: { books: Book[] }) {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <span>{book.title}</span>
          <span>{book.author}</span>
          <span>{book.status}</span>
          <span>{book.pagesRead} / {book.totalPages}</span>
        </li>
      ))}
    </ul>
  )
}
