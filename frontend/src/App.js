import React, { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { ALL_AUTHORS_QUERY, ALL_BOOKS_QUERY } from "./queries"
import { useQuery } from "@apollo/client"

const App = () => {
  const [page, setPage] = useState("authors")
  const authors = useQuery(ALL_AUTHORS_QUERY)
  const books = useQuery(ALL_BOOKS_QUERY)

  if (authors.loading || books.loading) {
    return <div>Loading front page</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authors.data.allAuthors} />

      <Books show={page === "books"} books={books.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  )
}

export default App
