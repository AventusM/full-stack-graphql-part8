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
