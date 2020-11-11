import React, { Fragment, useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import {
  ALL_AUTHORS_QUERY,
  ALL_BOOKS_QUERY,
  CURRENT_USER_QUERY,
  BOOK_ADDED_SUBSCRIPTION,
} from "./queries"
import {
  useQuery,
  useApolloClient,
  useSubscription,
  useMutation,
} from "@apollo/client"
import LoginForm from "./components/Login"
import Recommendations from "./components/Recommendations"

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("authors")
  const authors = useQuery(ALL_AUTHORS_QUERY)
  const books = useQuery(ALL_BOOKS_QUERY)
  const currentUser = useQuery(CURRENT_USER_QUERY)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map((p) => p.id).includes(object.id)

    const booksInStore = client.readQuery({ query: ALL_BOOKS_QUERY })
    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS_QUERY,
        data: { allBooks: booksInStore.allBooks.concat(addedBook) },
      })
    }

    const authorsInStore = client.readQuery({ query: ALL_AUTHORS_QUERY })
    if (!includedIn(authorsInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS_QUERY,
        data: {
          allAuthors: authorsInStore.allAuthors.concat(addedBook.author),
        },
      })
    }
  }

  useSubscription(BOOK_ADDED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`)
      try {
        updateCacheWith(addedBook)
      } catch (e) {
        console.log("error", e)
      }
    },
  })

  if (authors.loading || books.loading || currentUser.loading) {
    return <div>Loading front page</div>
  }

  const logout = () => {
    setPage("login")
    setToken(null)
    //localStorage.clear() --> Logging in after logout without refreshing browser will result in currentUser being null
    client.resetStore()
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
        <button onClick={() => setPage("recommendations")}>recommend</button>
        <button onClick={() => logout()}>logout</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={authors.data.allAuthors}
        tokenSet
      />
      <Books show={page === "books"} books={books.data.allBooks} />
      <Recommendations
        show={page === "recommendations"}
        books={books.data.allBooks}
        currentUser={currentUser.data.me}
      />
      <NewBook show={page === "add"} updateCacheWith={updateCacheWith} />
    </Fragment>
  )
}

export default App
