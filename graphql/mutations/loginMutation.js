const LoggedInUserType = require("../types/LoggedInUserType");
const LoginCredentialsInputType = require("../inputTypes/LoginCredentialsInputType");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../constants");
const { findUserByUsername } = require("../../fakeDb");
const { GraphQLUnionType } = require("graphql");
const FailedAuthenticationType = require("../types/FailedAuthenticationType");

const loginMutation = {
    type: new GraphQLUnionType({
        name: 'LoginMutationUnion',
        types: [LoggedInUserType, FailedAuthenticationType],
        resolveType: (value) => {
            if(value.token) {
                return 'LoggedInUser';
            }

            return 'FailedAuthentication';
        }
    }),
    args: {
        input: {
            type: LoginCredentialsInputType
        }
    },
    resolve: async (_, args) => {
        const { username, password } = args.input;
        try {
            const user = await findUserByUsername(username);
            if (user.password === password) {
                const token = jwt.sign({
                    sub: user.id,
                }, JWT_SECRET_KEY);

                return {
                    id: user.id,
                    token,
                };
            }

            return  {
                reason: "Incorrect Password",
            }
        } catch(exception) {
            return {
                reason: exception,
            }
        }
    }
}

module.exports = loginMutation;