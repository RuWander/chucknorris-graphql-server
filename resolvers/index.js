const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AuthorizationError } = require('./../errors');
const { addUser } = require('../controllers')

const { getUserByEmail, } = require('../controllers');

const authenticateUser = (context, { email, password }) => {
  return getUserByEmail(email)
    .then(existingUser => {
      if (!existingUser) {
        throw new AuthorizationError({
          message: `User with ${email} does not exist`
        });
      }
      const validPassword = bcrypt.compareSync(password, existingUser.password)
      if (validPassword) {
        const token = jwt.sign(existingUser.password, process.env.JWT_SECRET);
        delete existingUser.password
        return {
          user: existingUser,
          token: token
        }
      } else {
        throw new AuthorizationError({
          message: `User password did not match`
        });
      }
    })

}

const hashPasswordAndRegisterUser = (context, user) => {
  if (!user.email || !user.password) {
    throw new AuthorizationError({
      message: `Please provide an email and a password for successful registration`
    });
  }

  return getUserByEmail(user.email)
    .then(existingUser => {
      if (existingUser) {
        throw new AuthorizationError({
          message: `User with this email already exists`
        });
      }
      const hash = bcrypt.hashSync(user.password, 10)
      return addUser(user.username, user.email, hash)
    })
    .then(newUser => {
      const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET)
      delete newUser.password

      const loginPayload = {
        user: newUser,
        token: token
      }
      return loginPayload
    })
    .catch(err => {
      return err
    })

}

const checkAuthAndResolve = (context, controller) => {
  const token = context.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: `You must supply a JWT for authorization!`
    });
  }
  const decoded = jwt.verify(
    token.replace('Bearer ', ''),
    process.env.JWT_SECRET
  );
  return controller.apply(this, [decoded]);
};

const checkScopesAndResolve = (
  context,
  expectedScopes,
  controller,
  ...params
) => {
  const token = context.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: `You must supply a JWT for authorization!`
    });
  }
  const decoded = jwt.verify(
    token.replace('Bearer ', ''),
    process.env.JWT_SECRET
  );
  const scopes = decoded.scope;
  if (!scopes) {
    throw new AuthorizationError({ message: 'No scopes supplied!' });
  }
  if (scopes && expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
    return controller.apply(this, params);
  } else {
    throw new AuthorizationError({
      message: `You are not authorized. Expected scopes: ${expectedScopes.join(
        ', '
      )}`
    });
  }
};

module.exports = {
  checkAuthAndResolve,
  checkScopesAndResolve,
  authenticateUser,
  hashPasswordAndRegisterUser
};