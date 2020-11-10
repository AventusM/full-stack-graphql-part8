const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server")
const { v1: uuid } = require("uuid")
const mongoose = require("mongoose")

const Author = require("./models/author")
const Book = require("./models/book")
const User = require("./models/user")

const jwt = require("jsonwebtoken")
const JWT_SECRET = "WOW_VWERY_FANTASTIC_BODY"

const MONGODB_URI =
  "mongodb+srv://AntonAdmin:hjVqQjM1s5487aMs@graphql.ws6dg.mongodb.net/graphql?retryWrites=true&w=majority"

console.log("connecting to", MONGODB_URI)

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Mutation: {
    addBook: async (root, args, context) => {
      const { currentUser } = context

      if (!currentUser) {
        throw new AuthenticationError(
          "Cannot add a book. Authentication missing!"
        )
      }

      const { title, author, published, genres } = args
      const newBook = new Book({ title, published, genres })
      const authorExists = await Author.findOne({ name: author })

      const usedAuthor = authorExists
        ? await Author.findOne({ name: author })
        : new Author({ name: author })

      try {
        newBook.author = usedAuthor
        //usedAuthor.books = usedAuthor.books.concat(newBook)
        if (!authorExists) {
          await usedAuthor.save()
        }

        await newBook.save()
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: args }) // Catches both author name length & book title length
      }

      return newBook
    },

    editAuthor: async (root, args, context) => {
      const { currentUser } = context

      if (!currentUser) {
        throw new AuthenticationError(
          "Cannot edit author. Authentication missing!"
        )
      }

      const { name, setBornTo } = args
      const foundAuthor = await Author.findOne({ name }) // Might be null, try/catch will detect this though

      try {
        foundAuthor.born = setBornTo
        await foundAuthor.save()
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: args }) // Catches birthyear type failures (e.g. string instead of number)
      }
      return foundAuthor
    },

    createUser: async (root, args) => {
      const { username, favoriteGenre } = args // Future TODO: Dynamic pw's
      const newUser = new User({ username, favoriteGenre })

      try {
        await newUser.save()
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: args })
      }

      return newUser
    },

    login: async (root, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })

      if (!user || password !== "secret") {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: () => Book.find({}).populate("author"),
    allAuthors: () => Author.find({}).populate("books"),
  },
  Author: {
    bookCount: async (root) => {
      const allBooks = await Book.find({}).populate("author")
      const filteredBooks = allBooks.filter(
        (book) => book.author.name === root.name
      )
      return filteredBooks.length
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
