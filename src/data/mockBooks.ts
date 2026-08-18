import type { Book } from '../types'

export const mockBooks: Book[] = [
  { id: '1', title: 'Dune', author: 'Frank Herbert', totalPages: 412, pagesRead: 100, status: 'reading' },
  { id: '2', title: 'Foundation', author: 'Isaac Asimov', totalPages: 255, pagesRead: 0, status: 'to-read' },
  { id: '3', title: 'The Hobbit', author: 'J.R.R. Tolkien', totalPages: 310, pagesRead: 310, status: 'finished' },
  { id: '4', title: 'Neuromancer', author: 'William Gibson', totalPages: 271, pagesRead: 0, status: 'to-read' },
  { id: '5', title: 'Snow Crash', author: 'Neal Stephenson', totalPages: 470, pagesRead: 200, status: 'reading' },
  { id: '6', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', totalPages: 304, pagesRead: 304, status: 'finished' },
]
