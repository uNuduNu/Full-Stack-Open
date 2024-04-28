import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
    }
    published
    genres
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const SET_BIRTHYEAR = gql`
  mutation ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}  
`;

export const FAVORITE_BOOKS = gql`
  query {
    favoriteBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}  
`

export const ADD_BOOK = gql`
  mutation (
      $title: String!
      $published: Int!
      $author: String!
      $genres: [String!]!
      ) {
      addBook(
          title: $title
          published: $published
          author: $author
          genres: $genres
      ) {
        ...BookDetails
      }
  }
  ${BOOK_DETAILS}  
`;

export const LOGIN = gql`
  mutation ($username: String!, $password: String!)  {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`