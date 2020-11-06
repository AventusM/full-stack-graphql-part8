import { gql } from "@apollo/client"

export const ALL_AUTHORS_QUERY = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`

export const ALL_BOOKS_QUERY = gql`
  query {
    allBooks {
      title
      author
      published
      genres
    }
  }
`

export const ADD_NEW_BOOK_MUTATION = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
    }
  }
`
