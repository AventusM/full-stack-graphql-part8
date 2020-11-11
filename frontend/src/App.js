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

  useSubscription(BOOK_ADDED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert("New book added!")
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
      <NewBook show={page === "add"} />
    </Fragment>
  )
}

export default App
