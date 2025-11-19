const LoggedInUserType = require("../types/LoggedInUserType");
const LoginCredentialsInputType = require("../inputTypes/LoginCredentialsInputType");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../constants");
const db = require("../../models");
const bcrypt = require("bcrypt");

const loginMutation = {
    type: LoggedInUserType,
    args: {
        input: {
            type: LoginCredentialsInputType
        }
    },
    resolve: async (_, args) => {
        const { username, password } = args.input;
        
        const user = await db.User.findOne({ where: { username } });

        if(!user) {
            return {
                id: 0,
                token: "invalid_token",
            }
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({
                sub: user.id,
            }, JWT_SECRET_KEY);

            return {
                id: user.id,
                token,
            };
        }

        return {
            id: 0,
            token: "invalid_token",
        }
    }
}

module.exports = loginMutation;