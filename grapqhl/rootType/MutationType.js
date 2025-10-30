const { GraphQLObjectType } = require("graphql");
const createStudentMutation = require("../mutations/createStudentMutation");

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createStudent: createStudentMutation
    }
});

module.exports = MutationType;