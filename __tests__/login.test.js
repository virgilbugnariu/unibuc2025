const db = require('../models');
const { app } = require('../app');
const { createTestUser, graphqlRequest } = require('./helpers');

const LOGIN_MUTATION = `
        mutation Login($username: String!, $password: String!) {
            login(input: { username: $username, password: $password }) {
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


describe("Login Mutation", () => {
    beforeEach(async () => {
        await db.User.destroy({ where: {} });
    });


    test("should successfuly log in the user given correct credentials", async () => {
        await createTestUser({
            username: 'test1',
            password: 'test1',
            role: 'user',
        });

        const response = await graphqlRequest(app, LOGIN_MUTATION, {
            username: 'test1',
            password: 'test1',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.login.id).toBeDefined();
        expect(response.body.data.login.token).toBeDefined();
        expect(typeof response.body.data.login.token).toBe('string');
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.login.reason).toBeUndefined();
    });
});