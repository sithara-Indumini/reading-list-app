import { BookList } from './components/BookList'
import { useBooks } from './hooks/useBooks'
import './App.css'

function App() {
  const { books, updateStatus, updatePagesRead } = useBooks()

  return (
    <main>
      <h1>My Reading List</h1>
      <BookList books={books} onStatusChange={updateStatus} onPagesReadChange={updatePagesRead} />
    </main>
  )
}

export default App
