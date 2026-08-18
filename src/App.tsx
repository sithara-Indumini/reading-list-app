import { BookList } from './components/BookList'
import { useBooks } from './hooks/useBooks'
import './App.css'

function App() {
  const { books } = useBooks()

  return (
    <main>
      <h1>My Reading List</h1>
      <BookList books={books} />
    </main>
  )
}

export default App
