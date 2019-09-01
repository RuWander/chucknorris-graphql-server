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

const getUserById = (id) => {
  return axios.get(`http://localhost:3000/users/${id}`)
    .then(res => {
      console.log(res)
      const user = res.data;
      delete user.password
      return user;
    })
}

const getUserByEmail = (email) => {
  return axios.get(`http://localhost:3000/users/`, { params: { email } })
    .then(res => {
      const user = res.data[0];
      console.log(user)
      if(user === undefined) {
        return false
      }
      return user;
    })
    .catch(err => console.log(err))
}

const addUser = (username, email, password) => {
  return axios.post(`http://localhost:3000/users`,
    {
      username,
      email,
      password
    })
    .then(res => {
      console.log('user add successfully')
      const user = res.data;
      return user;
    })
}

module.exports = {
  getCategories,
  getQuoteForCategory,
  getRandomQuote,
  getQuotesBySearch,
  getUserById,
  getUserByEmail,
  addUser
}