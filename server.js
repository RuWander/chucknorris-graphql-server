require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

// const { checkAuthAndResolve, checkScopesAndResolve } = require('./resolvers');
const { getCategories, getQuoteForCategory, getRandomQuote, getQuotesBySearch } = require('./controllers')
const axios = require('axios');

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

type Query {
  quoteForCategory(category: String): Quote
  categories: [String]
  randomQuote: Quote
  searchQuote(search: String): [Quote]
}

`;

const resolvers = {
  Query: {
    categories: (_, args, context) => {
      return getCategories()
    },
    quoteForCategory: (_, { category }, context) => {
      return getQuoteForCategory({category});
    },
    randomQuote: (_, args, context) => {
      return getRandomQuote()
    },
    searchQuote: (_, { search }, context) => {
      return getQuotesBySearch(search)
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