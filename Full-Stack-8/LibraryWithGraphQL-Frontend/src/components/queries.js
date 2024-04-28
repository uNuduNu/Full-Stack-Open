import { gql } from "@apollo/client";

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
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`;

export const FAVORITE_BOOKS = gql`
  query {
    favoriteBooks {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
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
          title
          published
          author {
            name
            born
          }
          genres
      }
  }
`;

export const LOGIN = gql`
  mutation ($username: String!, $password: String!)  {
    login(username: $username, password: $password) {
      value
    }
  }
`