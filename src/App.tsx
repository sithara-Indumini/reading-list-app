import { BookList } from './components/BookList'
import { useBooks } from './hooks/useBooks'
import './App.css'

function App() {
  const { books, updateStatus } = useBooks()

  return (
    <main>
      <h1>My Reading List</h1>
      <BookList books={books} onStatusChange={updateStatus} />
    </main>
  )
}

export default App
