const { app } = require('../app');
const { graphqlRequest, createTestUser } = require('./helpers');
const db = require('../models');

describe('Login Mutation', () => {
  beforeEach(async () => {
    await db.User.destroy({ where: {} });
  });

  const LOGIN_MUTATION = `
    mutation Login($input: LoginCredentialsInputType!) {
      login(input: $input) {
        ... on LoggedInUser {
          id
          token
        }
        ... on FailedAuthentication {
          reason
        }
      }
    }
  `;

  test('should successfully login with valid credentials', async () => {
    const { plainPassword } = await createTestUser({
      username: 'validuser',
      password: 'validpassword',
      role: 'user',
    });

    const response = await graphqlRequest(app, LOGIN_MUTATION, {
      input: {
        username: 'validuser',
        password: plainPassword,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login.id).toBeDefined();
    expect(response.body.data.login.token).toBeDefined();
    expect(typeof response.body.data.login.token).toBe('string');
    expect(response.body.data.login.reason).toBeUndefined();
  });

  test('should fail login with incorrect password', async () => {
    await createTestUser({
      username: 'testuser',
      password: 'correctpassword',
    });

    const response = await graphqlRequest(app, LOGIN_MUTATION, {
      input: {
        username: 'testuser',
        password: 'wrongpassword',
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login.reason).toBe('Incorrect Password');
    expect(response.body.data.login.token).toBeUndefined();
  });

  test('should fail login with non-existent username', async () => {
    const response = await graphqlRequest(app, LOGIN_MUTATION, {
      input: {
        username: 'nonexistentuser',
        password: 'anypassword',
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login.reason).toBe('Incorrect Password');
    expect(response.body.data.login.token).toBeUndefined();
  });

  test('should fail login with empty credentials', async () => {
    const response = await graphqlRequest(app, LOGIN_MUTATION, {
      input: {
        username: '',
        password: '',
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.login.reason).toBe('Incorrect Password');
  });

  test('should return valid JWT token on successful login', async () => {
    const { plainPassword, user } = await createTestUser({
      username: 'jwtuser',
      password: 'jwtpassword',
    });

    const response = await graphqlRequest(app, LOGIN_MUTATION, {
      input: {
        username: 'jwtuser',
        password: plainPassword,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.data.login.token).toBeDefined();

    const jwt = require('jsonwebtoken');
    const { JWT_SECRET_KEY } = require('../constants');
    const decoded = jwt.verify(response.body.data.login.token, JWT_SECRET_KEY);

    expect(decoded.sub).toBe(user.id);
  });
});
