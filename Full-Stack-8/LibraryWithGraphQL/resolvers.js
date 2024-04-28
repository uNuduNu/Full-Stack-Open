const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
            return root.books.length
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
                bookAuthor.books.push(book._id)
                await bookAuthor.save()
            } catch (error) {
                throw new GraphQLError('Failed to save book', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: [args.title, args.published, args.genres],
                        error
                    }
                })
            }
            await book.populate('author', { name: 1, born: 1 })

            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
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
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
}

module.exports = resolvers
