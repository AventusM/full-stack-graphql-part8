import { gql } from "@apollo/client"

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const LOGIN_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

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
      author {
        name
      }
      published
      genres
    }
  }
`

export const ADD_NEW_BOOK_MUTATION = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const EDIT_BIRTH_YEAR = gql`
  mutation editBirthYear($name: String!, $birthYear: Int!) {
    editAuthor(name: $name, setBornTo: $birthYear) {
      name
      born
      id
      bookCount
    }
  }
`
