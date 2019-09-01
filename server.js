require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const { checkAuthAndResolve,
        checkScopesAndResolve,
        authenticateUser,
        hashPasswordAndRegisterUser } = require('./resolvers');

const { getCategories,
        getQuoteForCategory,
        getRandomQuote,
        getQuotesBySearch,
        getUserById,
        addUser } = require('./controllers')

const app = express();

const typeDefs = `
type Quote {
  id: ID!
  value: String!
  url: String!
  icon_url: String!
  created_at: String!
  updated_at: String!
  categories: [String]
}

type User {
  id: ID!
  username: String
  email: String!
}

type LoginPayload {
  user: User!
  token: String!
}

type Query {
  quoteForCategory(category: String): Quote
  categories: [String]
  randomQuote: Quote
  searchQuote(search: String): [Quote]
  getUserById(id: ID): User
}

type Mutation {
  register(username: String, email: String, password: String): LoginPayload
  login(email: String, password: String): LoginPayload 
}

`;

const resolvers = {
  Query: {
    categories: (_, args, context) => {
      return getCategories()
    },
    quoteForCategory: (_, { category }, context) => {
      return getQuoteForCategory({ category });
    },
    randomQuote: (_, args, context) => {
      // console.log(context.headers.authorization)
      return checkAuthAndResolve(context, getRandomQuote)
    },
    searchQuote: (_, { search }, context) => {
      return getQuotesBySearch(search)
    },
    getUserById: (_, { id }, context) => {
      return getUserById(id)
    }
  },

  Mutation: {
    register: (_, user, context) => {
      return hashPasswordAndRegisterUser(context, user)
    },
    login: (_, user, context) => {
      return authenticateUser(context, user)
    }

  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`))