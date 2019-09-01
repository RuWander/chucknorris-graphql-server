const axios = require('axios');

const getCategories = () => {
  return axios
    .get('https://api.chucknorris.io/jokes/categories/')
    .then(res => {
      console.log(res.data)
      return res.data
    })
}

const getQuoteForCategory = ({ category }) => {
  return axios.get('https://api.chucknorris.io/jokes/random', { params: { category: category } })
    .then(res => {
      console.log(res.data)
      return res.data
    })
}

const getRandomQuote = () => {
  return axios.get(`https://api.chucknorris.io/jokes/random`)
    .then(res => {
      console.log(res.data)
      return res.data
    })
}

const getQuotesBySearch = (search) => {
  return axios.get('https://api.chucknorris.io/jokes/search', { params: { query: search } })
    .then(res => {
      console.log(res)
      return res.data.result
    })
}

module.exports = { getCategories, getQuoteForCategory, getRandomQuote, getQuotesBySearch }