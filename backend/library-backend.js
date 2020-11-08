const { ApolloServer, gql } = require("apollo-server")
const { v1: uuid } = require("uuid")
const mongoose = require("mongoose")

const Author = require("./models/author")
const Book = require("./models/book")

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
  }
`

const resolvers = {
  Mutation: {
    addBook: async (root, args) => {
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
        return newBook
      } catch (e) {
        console.log("addBook error:", e.message)
      }
    },

    editAuthor: async (root, args) => {
      const { name, setBornTo } = args
      const foundAuthor = await Author.findOne({ name })
      foundAuthor.born = setBornTo

      try {
        await foundAuthor.save()
      } catch (e) {
        console.log("editAuthor error:", e.message)
      }
      return foundAuthor
      // TODO: Save
    },
  },
  Query: {
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
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
