require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
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
      return axios.get('https://api.chucknorris.io/jokes/categories/')
        .then(res => {
          console.log(res.data)
          return res.data
        })
    },
    quoteForCategory: (_, { category }, context) => {
      return axios.get('https://api.chucknorris.io/jokes/random', { params: { category: category } })
        .then(res => {
          console.log(res.data)
          return res.data
        })
    },
    randomQuote: (_, args, context) => {
      return axios.get(`https://api.chucknorris.io/jokes/random`)
        .then(res => {
          console.log(res.data)
          return res.data
        })
    },
    searchQuote: (_, {search}, context) => {
      return axios.get('https://api.chucknorris.io/jokes/search',{params:{query:search}})
          .then(res => {
            console.log(res)
            return res.data.result
          })
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