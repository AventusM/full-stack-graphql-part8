import React, { Fragment, useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { ALL_AUTHORS_QUERY, ALL_BOOKS_QUERY } from "./queries"
import { useQuery, useApolloClient } from "@apollo/client"
import LoginForm from "./components/Login"

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("authors")
  const authors = useQuery(ALL_AUTHORS_QUERY)
  const books = useQuery(ALL_BOOKS_QUERY)
  const client = useApolloClient()

  if (authors.loading || books.loading) {
    return <div>Loading front page</div>
  }

  const logout = async () => {
    setPage("login")
    setToken(null)
    localStorage.clear()
    await client.resetStore()
  }

  if (!token) {
    return (
      <Fragment>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>

        <Authors show={page === "authors"} authors={authors.data.allAuthors} />
        <Books show={page === "books"} books={books.data.allBooks} />
        <LoginForm
          show={page === "login"}
          setToken={setToken}
          setPage={setPage}
        />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => logout()}>logout</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={authors.data.allAuthors}
        tokenSet
      />
      <Books show={page === "books"} books={books.data.allBooks} />
      <NewBook show={page === "add"} />
    </Fragment>
  )
}

export default App
