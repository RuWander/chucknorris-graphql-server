# Chuck Norris GraphQL Wrapper

A GraphQL wrapper of the Chuck Norris Quote API.
This is just a demo to show how REST API can be wrapped with GraphQL. It also demonstrates how authentication with JWT can be implemented on top of the REST API.

## Installing

Install all the dependencies with:

```javascript
npm install
```

## Running the server

In order to run the server you have to start the GraphQL server as well as the mock database by running the following.

```javascript
npm run server
```

This will run nodemon on the server

To start the mock database run the following in a separate terminal:

 ```javascript
 json-server --watch db.json
```

## Features

All routes of the [Chuck Norris API](https://api.chucknorris.io/) can be queried through the GraphQL interface. Only the random jokes route is currently checking for an Authorization header (JWT token). All other routes can be protected by the simply wrapping the resolver in a `checkAuthAndResolve` function and passing the controller as an argument as well as the context of the request:

```javascript
categories: (_, args, context) => {
  return checkAuthAndResolve(context, getCategories)
},
```
