const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((error) => {
        console.log('failed to connect to mongodb: ', error.message)
    })

const typeDefs = `
    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String]!
    }

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    favoriteBooks: [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book,
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
      ): User
    login(
        username: String!
        password: String!
      ): Token
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (!args.author && !args.genre) {
                return Book.find({}).populate('author', { name: 1, born: 1 })
            }

            const allBooks = await Book.find({}).populate('author', { name: 1, born: 1 })
            return allBooks.filter(b => (args.author !== undefined ? b.author.name === args.author : true) && (args.genre !== undefined ? b.genres.find(g => g === args.genre) : true))
        },
        favoriteBooks: async (root, args, context) => {
            if (!context.currentUser || !context.currentUser.favoriteGenre) {
                return Book.find({}).populate('author', { name: 1, born: 1 })
            }

            const allBooks = await Book.find({}).populate('author', { name: 1, born: 1 })
            return allBooks.filter(b => b.genres.find(g => g === context.currentUser.favoriteGenre))
        },
        authorCount: async () => Author.collection.countDocuments(),
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => context.currentUser
    },
    Author: {
        bookCount: async (root) => {
            const books = await Book.find({}).populate('author', { name: 1, born: 1 })
            return books.filter(b => b.author.name === root.name).length
        }
    },
    Mutation: {
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if ( !user || args.password !== 'noonon' ) {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            let bookAuthor = await Author.findOne({ name: args.author })

            if (bookAuthor === null)
            {
                bookAuthor = new Author({ name: args.author })

                try {
                    await bookAuthor.save()
                } catch (error) {
                    throw new GraphQLError('Adding new author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    })
                }
            }

            const book = new Book({ title: args.title, published: args.published, genres: args.genres, author: bookAuthor._id })

            try {
                await book.save()
            } catch (error) {
                throw new GraphQLError('Failed to save book', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [args.title, args.published, args.genres],
                        error
                    }
                })
            }

            return book.populate('author', { name: 1, born: 1 })
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }

            const author = await Author.findOne({ name: args.name })

            if ( author !== null) {
                author.born = args.setBornTo

                try {
                    await author.save()
                } catch (error) {
                    throw new GraphQLError('Setting birth year failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.setBornTo,
                            error
                        }
                    })
                }
                return author
            }

            return null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})